package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"

	httpSwagger "github.com/swaggo/http-swagger"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	_ "github.com/Amir-Bitam/vite-project/backend/docs"
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

// Response models
// @Description Generic error response
type ErrorResponse struct {
	Message string `json:"message" example:"Error message details"`
}

// @Description Success response with data
type SuccessResponse struct {
	Message string      `json:"message" example:"Operation successful"`
	Data    interface{} `json:"data"`
}

// Farm represents a farm owned by a user
// @Description Farm information
// Farm represents a farm owned by a user
type Farm struct {
	ID          uint       `json:"id" example:"1"`
	CreatedAt   time.Time  `json:"created_at" example:"2024-01-01T00:00:00Z"`
	UpdatedAt   time.Time  `json:"updated_at" example:"2024-01-01T00:00:00Z"`
	DeletedAt   *time.Time `json:"deleted_at,omitempty" swaggertype:"string" format:"date-time"`
	Name        string     `json:"name" example:"Green Acres"`
	Address     string     `json:"address" example:"123 Farm Lane, Kansas City, KS 66101"`
	Size        float64    `json:"size" example:"100.5"`
	UserID      uint       `json:"user_id" example:"1"`
	CropTypes   []Crop     `json:"crops,omitempty"`
	LastHarvest time.Time  `json:"last_harvest" example:"2024-01-01T00:00:00Z"`
	Status      string     `json:"status" example:"active" enums:"active,inactive"`
}

// Crop represents a type of crop grown in a farm
type Crop struct {
	ID        uint       `json:"id" example:"1"`
	CreatedAt time.Time  `json:"created_at" example:"2024-01-01T00:00:00Z"`
	UpdatedAt time.Time  `json:"updated_at" example:"2024-01-01T00:00:00Z"`
	DeletedAt *time.Time `json:"deleted_at,omitempty" swaggertype:"string" format:"date-time"`
	Name      string     `json:"name" example:"Corn"`
	FarmID    uint       `json:"farm_id" example:"1"`
	PlantDate time.Time  `json:"plant_date" example:"2024-01-01T00:00:00Z"`
	YieldRate float64    `json:"yield_rate" example:"8.5"`
}

type Server struct {
	db     *gorm.DB
	router *mux.Router
}

// @Summary Get user's farms
// @Description Get all farms belonging to a specific user
// @Tags farms
// @Accept json
// @Produce json
// @Param id path int true "User ID"
// @Success 200 {array} Farm
// @Failure 500 {string} string "Internal server error"
// @Security BearerAuth
// @Router /users/{id}/farms [get]
func (s *Server) getUserFarms(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	var farms []Farm

	if result := s.db.Where("user_id = ?", vars["id"]).Preload("CropTypes").Find(&farms); result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(farms)
}

// @Summary Create a new farm
// @Description Create a new farm for a user
// @Tags farms
// @Accept json
// @Produce json
// @Param farm body Farm true "Farm object"
// @Success 201 {object} Farm "Farm created successfully"
// @Failure 400 {object} ErrorResponse "Invalid request payload"
// @Failure 500 {object} ErrorResponse "Internal server error"
// @Security Bearer
// @Router /farms [post]
func (s *Server) createFarm(w http.ResponseWriter, r *http.Request) {
	var farm Farm
	if err := json.NewDecoder(r.Body).Decode(&farm); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if result := s.db.Create(&farm); result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(farm)
}

// @Summary Get farm details
// @Description Get detailed information about a specific farm
// @Tags farms
// @Accept json
// @Produce json
// @Param id path int true "Farm ID"
// @Success 200 {object} Farm "Farm details retrieved successfully"
// @Failure 404 {object} ErrorResponse "Farm not found"
// @Security Bearer
// @Router /farms/{id} [get]
func (s *Server) getFarm(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	var farm Farm

	if result := s.db.Preload("CropTypes").First(&farm, vars["id"]); result.Error != nil {
		http.Error(w, "Farm not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(farm)
}

// @Summary Update farm details
// @Description Update information about a specific farm
// @Tags farms
// @Accept json
// @Produce json
// @Param id path int true "Farm ID"
// @Param farm body Farm true "Farm object"
// @Success 200 {object} Farm "Farm updated successfully"
// @Failure 400 {object} ErrorResponse "Invalid request payload"
// @Failure 404 {object} ErrorResponse "Farm not found"
// @Security Bearer
// @Router /farms/{id} [put]
func (s *Server) updateFarm(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	var farm Farm

	if result := s.db.First(&farm, vars["id"]); result.Error != nil {
		http.Error(w, "Farm not found", http.StatusNotFound)
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&farm); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	s.db.Save(&farm)
	json.NewEncoder(w).Encode(farm)
}

// @Summary Delete a farm
// @Description Delete a specific farm
// @Tags farms
// @Accept json
// @Produce json
// @Param id path int true "Farm ID"
// @Success 204 "Farm deleted successfully"
// @Failure 404 {object} ErrorResponse "Farm not found"
// @Security Bearer
// @Router /farms/{id} [delete]
func (s *Server) deleteFarm(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	var farm Farm

	if result := s.db.First(&farm, vars["id"]); result.Error != nil {
		http.Error(w, "Farm not found", http.StatusNotFound)
		return
	}

	s.db.Delete(&farm)
	w.WriteHeader(http.StatusNoContent)
}

// @Summary Delete a user
// @Description Delete a specific user
// @Tags users
// @Accept json
// @Produce json
// @Param id path int true "User ID"
// @Success 204 "User deleted successfully"
// @Failure 404 {object} ErrorResponse "User not found"
// @Security Bearer
// @Router /users/{id} [delete]
func (s *Server) deleteUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	var user User

	if result := s.db.First(&user, vars["id"]); result.Error != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	s.db.Delete(&user)
	w.WriteHeader(http.StatusNoContent)
}

// @Summary Update user details
// @Description Update information about a specific user
// @Tags users
// @Accept json
// @Produce json
// @Param id path int true "User ID"
// @Param user body User true "User object"
// @Success 200 {object} User "User updated successfully"
// @Failure 400 {object} ErrorResponse "Invalid request payload"
// @Failure 404 {object} ErrorResponse "User not found"
// @Security Bearer
// @Router /users/{id} [put]
func (s *Server) updateUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	var user User

	if result := s.db.First(&user, vars["id"]); result.Error != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	s.db.Save(&user)
	json.NewEncoder(w).Encode(user)
}

// @Summary Add a crop to a farm
// @Description Add a new crop to a specific farm
// @Tags crops
// @Accept json
// @Produce json
// @Param farm_id path int true "Farm ID"
// @Param crop body Crop true "Crop object"
// @Success 201 {object} Crop "Crop added successfully"
// @Failure 400 {object} ErrorResponse "Invalid request payload"
// @Failure 404 {object} ErrorResponse "Farm not found"
// @Failure 500 {object} ErrorResponse "Internal server error"
// @Security Bearer
// @Router /farms/{farm_id}/crops [post]
func (s *Server) addCrop(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	var crop Crop

	// Parse farm_id from string to uint
	farmID, err := strconv.ParseUint(vars["farm_id"], 10, 32)
	if err != nil {
		http.Error(w, "Invalid farm ID", http.StatusBadRequest)
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&crop); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	crop.FarmID = uint(farmID)

	if result := s.db.Create(&crop); result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(crop)
}

func NewServer() (*Server, error) {
	db, err := gorm.Open(sqlite.Open("farm.db"), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	// Auto migrate models
	db.AutoMigrate(&Farm{}, &Crop{}, &User{})

	server := &Server{
		db:     db,
		router: mux.NewRouter(),
	}

	server.setupRoutes()
	return server, nil
}

func (s *Server) setupRoutes() {
	// API routes
	apiRouter := s.router.PathPrefix("/api/v1").Subrouter()

	// Auth routes
	apiRouter.HandleFunc("/auth/register", s.register).Methods("POST")
	apiRouter.HandleFunc("/auth/login", s.login).Methods("POST")

	// User routes
	apiRouter.HandleFunc("/users/{id}", s.authMiddleware(s.getUser)).Methods("GET")
	apiRouter.HandleFunc("/users/{id}", s.authMiddleware(s.updateUser)).Methods("PUT")
	apiRouter.HandleFunc("/users/{id}", s.authMiddleware(s.deleteUser)).Methods("DELETE")
	apiRouter.HandleFunc("/users", s.authMiddleware(s.adminMiddleware(s.getAllUsers))).Methods("GET")
	apiRouter.HandleFunc("/users/{id}/farms", s.authMiddleware(s.getUserFarms)).Methods("GET")

	// Farm routes
	apiRouter.HandleFunc("/farms", s.authMiddleware(s.createFarm)).Methods("POST")
	apiRouter.HandleFunc("/farms/{id}", s.authMiddleware(s.getFarm)).Methods("GET")
	apiRouter.HandleFunc("/farms/{id}", s.authMiddleware(s.updateFarm)).Methods("PUT")
	apiRouter.HandleFunc("/farms/{id}", s.authMiddleware(s.deleteFarm)).Methods("DELETE")
	apiRouter.HandleFunc("/farms/{id}/crops", s.authMiddleware(s.getFarmCrops)).Methods("GET")
	apiRouter.HandleFunc("/farms/{id}/crops", s.authMiddleware(s.addCrop)).Methods("POST")

	// Swagger docs
	apiRouter.PathPrefix("/swagger/").Handler(httpSwagger.WrapHandler)

	// ===== FRONTEND STATIC FILE SERVING =====

	// 1. Serve static files with correct paths
	// Debug files first (highest priority)
	s.router.Path("/debug.html").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./build/debug.html")
	})
	s.router.Path("/test-app.html").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./build/test-app.html")
	})

	// 2. Serve the logo file
	s.router.Path("/TecAdvisor.png").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./build/TecAdvisor.png")
	})

	// 3. Serve assets directory - JS, CSS, fonts, images in /assets
	fs := http.FileServer(http.Dir("./build/assets"))
	s.router.PathPrefix("/assets/").Handler(http.StripPrefix("/assets/", fs))

	// 4. Handle all React router routes
	// This is crucial for client-side routing with react-router
	reactRoutes := []string{
		"/signup",
		"/ajoutferme",
		"/vosfermes",
		"/tableaudebord",
		"/usersmanagment",
		"/", // Root path last
	}

	for _, route := range reactRoutes {
		s.router.Path(route).HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			http.ServeFile(w, r, "./build/index.html")
		})
	}

	// 5. Fallback handler for any other routes
	// Serve index.html for all non-API and non-matched routes (SPA routing)
	s.router.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Skip API routes that weren't matched
		if len(r.URL.Path) >= 5 && r.URL.Path[:5] == "/api/" {
			http.NotFound(w, r)
			return
		}

		// For all other routes, serve the React app
		http.ServeFile(w, r, "./build/index.html")
	})
}

// @Summary Get farm crops
// @Description Get all crops for a specific farm
// @Tags crops
// @Accept json
// @Produce json
// @Param farm_id path int true "Farm ID"
// @Success 200 {array} Crop "List of crops retrieved successfully"
// @Failure 400 {object} ErrorResponse "Invalid farm ID"
// @Failure 404 {object} ErrorResponse "Farm not found"
// @Failure 500 {object} ErrorResponse "Internal server error"
// @Security Bearer
// @Router /farms/{farm_id}/crops [get]
func (s *Server) getFarmCrops(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	// Parse farm_id from string to uint
	farmID, err := strconv.ParseUint(vars["farm_id"], 10, 32)
	if err != nil {
		http.Error(w, "Invalid farm ID", http.StatusBadRequest)
		return
	}

	// First check if the farm exists
	var farm Farm
	if result := s.db.First(&farm, farmID); result.Error != nil {
		http.Error(w, "Farm not found", http.StatusNotFound)
		return
	}

	var crops []Crop
	if result := s.db.Where("farm_id = ?", farmID).Find(&crops); result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(crops)
}

func main() {
	server, err := NewServer()
	if err != nil {
		log.Fatalf("Failed to initialize server: %v", err)
	}

	// Get port from environment variable or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// CORS middleware configuration
	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"http://localhost:5173", "http://localhost:3000", "*"}), // Add your frontend URLs here
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
		handlers.AllowCredentials(),
	)

	log.Printf("Server starting on :%s", port)
	log.Printf("API documentation available at http://localhost:%s/api/v1/swagger/index.html", port)
	if err := http.ListenAndServe(":"+port, corsHandler(server.router)); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
