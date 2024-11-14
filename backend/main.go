package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// User represents a user in the system
type User struct {
	gorm.Model
	Email    string `json:"email" gorm:"unique"`
	Name     string `json:"name"`
	Password string `json:"-"` // Password is not exposed in JSON
	Farms    []Farm `json:"farms"`
}

// Farm represents a farm owned by a user
type Farm struct {
	gorm.Model
	Name        string    `json:"name"`
	Location    string    `json:"location"`
	Size        float64   `json:"size"` // in hectares
	UserID      uint      `json:"user_id"`
	CropTypes   []Crop    `json:"crops"`
	LastHarvest time.Time `json:"last_harvest"`
	Status      string    `json:"status"`
}

// Crop represents a type of crop grown in a farm
type Crop struct {
	gorm.Model
	Name      string    `json:"name"`
	Area      float64   `json:"area"` // in hectares
	FarmID    uint      `json:"farm_id"`
	PlantDate time.Time `json:"plant_date"`
	YieldRate float64   `json:"yield_rate"` // expected yield per hectare
}

type Server struct {
	db     *gorm.DB
	router *mux.Router
}

func NewServer() (*Server, error) {
	// Open SQLite database
	db, err := gorm.Open(sqlite.Open("farm.db"), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	// Auto migrate the schemas
	err = db.AutoMigrate(&User{}, &Farm{}, &Crop{})
	if err != nil {
		return nil, err
	}

	server := &Server{
		db:     db,
		router: mux.NewRouter(),
	}

	server.setupRoutes()
	return server, nil
}

func (s *Server) setupRoutes() {
	// User routes
	s.router.HandleFunc("/users", s.createUser).Methods("POST")
	s.router.HandleFunc("/users/{id}", s.getUser).Methods("GET")
	s.router.HandleFunc("/users/{id}/farms", s.getUserFarms).Methods("GET")

	// Farm routes
	s.router.HandleFunc("/farms", s.createFarm).Methods("POST")
	s.router.HandleFunc("/farms/{id}", s.getFarm).Methods("GET")
	s.router.HandleFunc("/farms/{id}", s.updateFarm).Methods("PUT")
	s.router.HandleFunc("/farms/{id}", s.deleteFarm).Methods("DELETE")

	// Crop routes
	s.router.HandleFunc("/farms/{farm_id}/crops", s.addCrop).Methods("POST")
	s.router.HandleFunc("/farms/{farm_id}/crops", s.getFarmCrops).Methods("GET")
}

// Handler functions
func (s *Server) createUser(w http.ResponseWriter, r *http.Request) {
	var user User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if result := s.db.Create(&user); result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(user)
}

func (s *Server) getUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	var user User

	if result := s.db.Preload("Farms").First(&user, vars["id"]); result.Error != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(user)
}

func (s *Server) getUserFarms(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	var farms []Farm

	if result := s.db.Where("user_id = ?", vars["id"]).Preload("CropTypes").Find(&farms); result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
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

	if result := s.db.Preload("CropTypes").First(&farm, vars["id"]); result.Error != nil {
		http.Error(w, "Farm not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(farm)
}

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

func (s *Server) addCrop(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	var crop Crop

	if err := json.NewDecoder(r.Body).Decode(&crop); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	crop.FarmID = uint(json.Number(vars["farm_id"]).Int64())

	if result := s.db.Create(&crop); result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(crop)
}

func (s *Server) getFarmCrops(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	var crops []Crop

	if result := s.db.Where("farm_id = ?", vars["farm_id"]).Find(&crops); result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(crops)
}

func main() {
	server, err := NewServer()
	if err != nil {
		log.Fatalf("Failed to initialize server: %v", err)
	}

	log.Println("Server starting on :8080")
	if err := http.ListenAndServe(":8080", server.router); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
