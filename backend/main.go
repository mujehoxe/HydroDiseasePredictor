package main

import (
	"log"
	"net/http"

	"github.com/HydroDiseasePredictor/backend/api/controller"
	"github.com/HydroDiseasePredictor/backend/api/middleware"
	"github.com/HydroDiseasePredictor/backend/config"
	"github.com/HydroDiseasePredictor/backend/domain/model"
	"github.com/HydroDiseasePredictor/backend/domain/service"
	"github.com/HydroDiseasePredictor/backend/infrastructure/persistence"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	httpSwagger "github.com/swaggo/http-swagger"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	_ "github.com/HydroDiseasePredictor/backend/docs"
)

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization

// @title Farm Management API
// @version 1.0
// @description This is a farm management server.
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.email support@farmmanagement.io

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @BasePath /api/v1

// App represents the application
type App struct {
	config     *config.Config
	db         *gorm.DB
	router     *mux.Router
	authMiddle *middleware.AuthMiddleware
}

// NewApp creates a new application
func NewApp() (*App, error) {
	// Load configuration
	cfg := config.NewConfig()

	// Initialize database
	db, err := gorm.Open(sqlite.Open(cfg.DBPath), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	// Auto migrate models
	db.AutoMigrate(&model.User{}, &model.Farm{}, &model.Crop{})

	// Initialize repositories
	userRepo := persistence.NewSQLiteUserRepository(db)
	farmRepo := persistence.NewSQLiteFarmRepository(db)
	cropRepo := persistence.NewSQLiteCropRepository(db)

	// Initialize services
	userService := service.NewUserService(userRepo)
	farmService := service.NewFarmService(farmRepo, userRepo)
	cropService := service.NewCropService(cropRepo, farmRepo)
	authService := service.NewAuthService(userService)

	// Initialize controllers
	authController := controller.NewAuthController(authService, userService)
	userController := controller.NewUserController(userService)
	farmController := controller.NewFarmController(farmService)
	cropController := controller.NewCropController(cropService)

	// Initialize middleware
	authMiddle := middleware.NewAuthMiddleware(authService)

	// Initialize router
	router := mux.NewRouter()

	// Create app
	app := &App{
		config:     cfg,
		db:         db,
		router:     router,
		authMiddle: authMiddle,
	}

	// Setup routes
	app.setupRoutes(authController, userController, farmController, cropController)

	return app, nil
}

// setupRoutes configures the application routes
func (a *App) setupRoutes(
	authController *controller.AuthController,
	userController *controller.UserController,
	farmController *controller.FarmController,
	cropController *controller.CropController,
) {
	// API routes
	apiRouter := a.router.PathPrefix("/api/v1").Subrouter()

	// Auth routes (no authentication required)
	apiRouter.HandleFunc("/auth/register", authController.Register).Methods("POST")
	apiRouter.HandleFunc("/auth/login", authController.Login).Methods("POST")

	// User routes (authentication required)
	userRouter := apiRouter.PathPrefix("/users").Subrouter()
	userRouter.Use(a.authMiddle.Authenticate)
	userRouter.HandleFunc("/{id}", userController.GetUser).Methods("GET")
	userRouter.HandleFunc("/{id}", userController.UpdateUser).Methods("PUT")
	userRouter.HandleFunc("/{id}", userController.DeleteUser).Methods("DELETE")
	userRouter.HandleFunc("/{user_id}/farms", farmController.GetUserFarms).Methods("GET")

	// Admin routes
	adminRouter := apiRouter.PathPrefix("/admin").Subrouter()
	adminRouter.Use(a.authMiddle.Authenticate, a.authMiddle.RequireAdmin)
	adminRouter.HandleFunc("/users", userController.GetAllUsers).Methods("GET")

	// Farm routes
	farmRouter := apiRouter.PathPrefix("/farms").Subrouter()
	farmRouter.Use(a.authMiddle.Authenticate)
	farmRouter.HandleFunc("", farmController.CreateFarm).Methods("POST")
	farmRouter.HandleFunc("/{id}", farmController.GetFarm).Methods("GET")
	farmRouter.HandleFunc("/{id}", farmController.UpdateFarm).Methods("PUT")
	farmRouter.HandleFunc("/{id}", farmController.DeleteFarm).Methods("DELETE")

	// Crop routes
	cropRouter := apiRouter.PathPrefix("/farms/{farm_id}/crops").Subrouter()
	cropRouter.Use(a.authMiddle.Authenticate)
	cropRouter.HandleFunc("", cropController.GetFarmCrops).Methods("GET")
	cropRouter.HandleFunc("", cropController.AddCrop).Methods("POST")
	cropRouter.HandleFunc("/{id}", cropController.DeleteCrop).Methods("DELETE")

	// Swagger docs
	apiRouter.PathPrefix("/swagger/").Handler(httpSwagger.WrapHandler)

	// Static file serving for frontend
	a.setupStaticFileServing()
}

// setupStaticFileServing configures routes for serving static files
func (a *App) setupStaticFileServing() {
	// Debug files first (highest priority)
	a.router.Path("/debug.html").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./build/debug.html")
	})
	a.router.Path("/test-app.html").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./build/test-app.html")
	})

	// Serve the logo file
	a.router.Path("/TecAdvisor.png").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./build/TecAdvisor.png")
	})

	// Serve assets directory - JS, CSS, fonts, images in /assets
	fs := http.FileServer(http.Dir("./build/assets"))
	a.router.PathPrefix("/assets/").Handler(http.StripPrefix("/assets/", fs))

	// Handle all React router routes
	reactRoutes := []string{
		"/signup",
		"/ajoutferme",
		"/vosfermes",
		"/tableaudebord",
		"/usersmanagment",
		"/", // Root path last
	}

	for _, route := range reactRoutes {
		a.router.Path(route).HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			http.ServeFile(w, r, "./build/index.html")
		})
	}

	// Fallback handler for any other routes
	// Serve index.html for all non-API and non-matched routes (SPA routing)
	a.router.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Skip API routes that weren't matched
		if len(r.URL.Path) >= 5 && r.URL.Path[:5] == "/api/" {
			http.NotFound(w, r)
			return
		}

		// For all other routes, serve the React app
		http.ServeFile(w, r, "./build/index.html")
	})
}

// Run starts the application server
func (a *App) Run() error {
	// CORS middleware configuration
	corsHandler := handlers.CORS(
		handlers.AllowedOrigins(a.config.AllowedOrigins),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
		handlers.AllowCredentials(),
	)

	log.Printf("Server starting on port %s", a.config.ServerPort)
	log.Printf("API documentation available at http://localhost:%s/api/v1/swagger/index.html", a.config.ServerPort)
	
	return http.ListenAndServe(":"+a.config.ServerPort, corsHandler(a.router))
}

func main() {
	app, err := NewApp()
	if err != nil {
		log.Fatalf("Failed to initialize application: %v", err)
	}

	if err := app.Run(); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
} 