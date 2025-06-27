package main

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// Server represents the API server
type Server struct {
	db     *gorm.DB
	router *mux.Router
}

// NewServer creates a new server instance
func NewServer() (*Server, error) {
	// Initialize database
	db, err := gorm.Open(sqlite.Open("farm.db"), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	// Auto migrate models
	db.AutoMigrate(&User{}, &Farm{}, &Crop{})

	// Create router
	router := mux.NewRouter()

	// Create server
	server := &Server{
		db:     db,
		router: router,
	}

	// Setup routes
	server.setupRoutes()

	return server, nil
}

// setupRoutes configures the API routes
func (s *Server) setupRoutes() {
	// API routes
	api := s.router.PathPrefix("/api/v1").Subrouter()

	// Auth routes (no authentication required)
	api.HandleFunc("/auth/register", s.register).Methods("POST")
	api.HandleFunc("/auth/login", s.login).Methods("POST")

	// User routes (authentication required)
	userRouter := api.PathPrefix("/users").Subrouter()
	userRouter.Use(s.authMiddleware)
	userRouter.HandleFunc("/{id}", s.getUser).Methods("GET")
	userRouter.HandleFunc("/{user_id}/farms", s.getUserFarms).Methods("GET")

	// Farm routes
	farmRouter := api.PathPrefix("/farms").Subrouter()
	farmRouter.Use(s.authMiddleware)
	farmRouter.HandleFunc("", s.createFarm).Methods("POST")
	farmRouter.HandleFunc("/{id}", s.getFarm).Methods("GET")
	farmRouter.HandleFunc("/{id}", s.updateFarm).Methods("PUT")
	farmRouter.HandleFunc("/{id}", s.deleteFarm).Methods("DELETE")

	// Serve static files
	s.setupStaticFileServing()
}

// setupStaticFileServing configures routes for serving static files
func (s *Server) setupStaticFileServing() {
	// Serve assets directory - JS, CSS, fonts, images in /assets
	fs := http.FileServer(http.Dir("./build/assets"))
	s.router.PathPrefix("/assets/").Handler(http.StripPrefix("/assets/", fs))

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
		s.router.Path(route).HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			http.ServeFile(w, r, "./build/index.html")
		})
	}

	// Fallback handler for any other routes
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

// Run starts the server
func (s *Server) Run(port string) error {
	// CORS middleware configuration
	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
		handlers.AllowCredentials(),
	)

	log.Printf("Server starting on port %s", port)
	return http.ListenAndServe(":"+port, corsHandler(s.router))
}

// Farm represents a farm in the system
type Farm struct {
	ID      uint   `json:"id,omitempty" gorm:"primaryKey"`
	Name    string `json:"name"`
	Address string `json:"address"`
	UserID  uint   `json:"user_id"`
	Crops   []Crop `json:"crops,omitempty" gorm:"foreignKey:FarmID"`
}

// Crop represents a crop in the system
type Crop struct {
	ID     uint   `json:"id,omitempty" gorm:"primaryKey"`
	Name   string `json:"name"`
	Type   string `json:"type"`
	FarmID uint   `json:"farm_id"`
}

// User represents a user in the system
type User struct {
	ID        uint       `json:"id,omitempty" gorm:"primaryKey"`
	CreatedAt time.Time  `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time  `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt *time.Time `json:"deleted_at,omitempty" gorm:"index"`
	Email     string     `json:"email" gorm:"uniqueIndex"`
	Name      string     `json:"name"`
	Password  string     `json:"password,omitempty"`
	HashPass  string     `json:"-" gorm:"column:hash_pass;not null"` // Store hashed password
	Role      string     `json:"role" gorm:"default:user"`
	Farms     []Farm     `json:"farms,omitempty" gorm:"foreignKey:UserID"`
}

// Simple handlers for the routes
func (s *Server) register(w http.ResponseWriter, r *http.Request) {
	var user User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Hash the password before saving
	user.HashPass = hashPassword(user.Password)
	user.Password = "" // Don't store plaintext password

	if result := s.db.Create(&user); result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(user)
}

func (s *Server) login(w http.ResponseWriter, r *http.Request) {
	var loginReq struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	
	if err := json.NewDecoder(r.Body).Decode(&loginReq); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var user User
	result := s.db.Where("email = ?", loginReq.Email).First(&user)
	if result.Error != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	// Verify password
	if hashPassword(loginReq.Password) != user.HashPass {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	// Create JWT token
	token, err := createToken(user.ID, user.Email)
	if err != nil {
		http.Error(w, "Could not generate token", http.StatusInternalServerError)
		return
	}

	// Clear sensitive data
	user.HashPass = ""
	user.Password = ""

	response := struct {
		Token string `json:"token"`
		User  User   `json:"user"`
	}{
		Token: token,
		User:  user,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (s *Server) getUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	var user User

	if result := s.db.Preload("Farms").First(&user, vars["id"]); result.Error != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Don't expose password hash
	user.HashPass = ""
	user.Password = ""

	json.NewEncoder(w).Encode(user)
}

func (s *Server) getUserFarms(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userId := vars["user_id"]
	
	var farms []Farm
	if result := s.db.Where("user_id = ?", userId).Find(&farms); result.Error != nil {
		http.Error(w, "Failed to retrieve farms", http.StatusInternalServerError)
		return
	}
	
	json.NewEncoder(w).Encode(farms)
}

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

func (s *Server) getFarm(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	var farm Farm

	if result := s.db.Preload("Crops").First(&farm, vars["id"]); result.Error != nil {
		http.Error(w, "Farm not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(farm)
}

func (s *Server) updateFarm(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	var farm Farm

	// Check if farm exists
	if result := s.db.First(&farm, vars["id"]); result.Error != nil {
		http.Error(w, "Farm not found", http.StatusNotFound)
		return
	}

	// Decode the updated farm data
	if err := json.NewDecoder(r.Body).Decode(&farm); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Update the farm
	if result := s.db.Save(&farm); result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(farm)
}

func (s *Server) deleteFarm(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	// Delete the farm
	if result := s.db.Delete(&Farm{}, vars["id"]); result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// JWT secret key - in production, use environment variable
var jwtSecret = []byte(getEnvOrDefault("JWT_SECRET", "your-256-bit-secret"))

func getEnvOrDefault(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

// Helper function to hash passwords
func hashPassword(password string) string {
	hash := sha256.New()
	hash.Write([]byte(password))
	return hex.EncodeToString(hash.Sum(nil))
}

// Create a JWT token
func createToken(userID uint, email string) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"email":   email,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
		"iat":     time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

// Middleware to verify JWT token
func (s *Server) authMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization header required", http.StatusUnauthorized)
			return
		}

		// Extract bearer token
		splitToken := strings.Split(authHeader, "Bearer ")
		if len(splitToken) != 2 {
			http.Error(w, "Invalid token format", http.StatusUnauthorized)
			return
		}

		tokenStr := splitToken[1]

		// Parse and validate the token
		token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		// Extract claims
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			http.Error(w, "Invalid token claims", http.StatusUnauthorized)
			return
		}

		// Add user ID to request context
		ctx := context.WithValue(r.Context(), "user_id", claims["user_id"])
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func main() {
	server, err := NewServer()
	if err != nil {
		log.Fatalf("Failed to initialize server: %v", err)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	if err := server.Run(port); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
} 