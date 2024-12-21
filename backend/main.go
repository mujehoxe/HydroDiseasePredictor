package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"

	httpSwagger "github.com/swaggo/http-swagger"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	_ "github.com/Amir-Bitam/vite-project/backend/docs"
)

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

	err = db.AutoMigrate(&User{}, &Farm{}, &Crop{})
	if err != nil {
		return nil, err
	}

	server := &Server{
		db:     db,
		router: mux.NewRouter().PathPrefix("/api/v1").Subrouter(),
	}

	server.setupRoutes()
	return server, nil
}

func (s *Server) setupRoutes() {
	// Create a cors handler
	s.router.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}

			next.ServeHTTP(w, r)
		})
	})

	// Auth routes (no authentication required)
	s.router.HandleFunc("/auth/register", s.register).Methods("POST", "OPTIONS")
	s.router.HandleFunc("/auth/login", s.login).Methods("POST", "OPTIONS")

	// Protected routes (require authentication)
	s.router.HandleFunc("/users/{id}", s.authMiddleware(s.getUser)).Methods("GET", "OPTIONS")
	s.router.HandleFunc("/users/{id}/farms", s.authMiddleware(s.getUserFarms)).Methods("GET", "OPTIONS")
	s.router.HandleFunc("/farms", s.authMiddleware(s.createFarm)).Methods("POST", "OPTIONS")
	s.router.HandleFunc("/farms/{id}", s.authMiddleware(s.getFarm)).Methods("GET", "OPTIONS")
	s.router.HandleFunc("/farms/{id}", s.authMiddleware(s.updateFarm)).Methods("PUT", "OPTIONS")
	s.router.HandleFunc("/farms/{id}", s.authMiddleware(s.deleteFarm)).Methods("DELETE", "OPTIONS")
	s.router.HandleFunc("/farms/{farm_id}/crops", s.authMiddleware(s.addCrop)).Methods("POST", "OPTIONS")
	s.router.HandleFunc("/farms/{farm_id}/crops", s.authMiddleware(s.getFarmCrops)).Methods("GET", "OPTIONS")

	// Swagger documentation
	s.router.PathPrefix("/swagger/").Handler(httpSwagger.WrapHandler)
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

	// CORS middleware configuration
	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"http://localhost:5173", "http://localhost:3000", "*"}), // Add your frontend URLs here
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
		handlers.AllowCredentials(),
	)

	log.Println("Server starting on :8080")
	log.Println("API documentation available at http://localhost:8080/api/v1/swagger/index.html")
	if err := http.ListenAndServe(":8080", corsHandler(server.router)); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
