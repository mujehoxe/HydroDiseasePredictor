package main

import (
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

// User represents a user in the system
type User struct {
	ID       int    `json:"id,omitempty"`
	Email    string `json:"email"`
	Name     string `json:"name"`
	Password string `json:"password,omitempty"`
	HashPass string `json:"-"` // This is the hash_pass column in the database
	Role     string `json:"role"`
}

// RegisterRequest represents registration credentials
type RegisterRequest struct {
	Email    string `json:"email"`
	Name     string `json:"name"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

// Helper function to hash passwords
func hashPassword(password string) string {
	hash := sha256.New()
	hash.Write([]byte(password))
	return hex.EncodeToString(hash.Sum(nil))
}

func main() {
	// Open SQLite database
	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "farm.db"
	}

	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}
	defer db.Close()

	// Check if hash_pass column exists
	rows, err := db.Query("PRAGMA table_info(users)")
	if err != nil {
		log.Fatalf("Failed to query table info: %v", err)
	}

	var hasHashPass bool
	var id, notnull, pk int
	var name, colType, dflt_value string
	
	fmt.Println("Columns in users table:")
	for rows.Next() {
		if err := rows.Scan(&id, &name, &colType, &notnull, &dflt_value, &pk); err != nil {
			log.Fatalf("Failed to scan column info: %v", err)
		}
		fmt.Printf("Column: %s, Type: %s, NotNull: %d\n", name, colType, notnull)
		if name == "hash_pass" {
			hasHashPass = true
		}
	}
	rows.Close()

	// If hash_pass column doesn't exist, add it
	if !hasHashPass {
		fmt.Println("Adding hash_pass column to users table")
		_, err = db.Exec("ALTER TABLE users ADD COLUMN hash_pass TEXT")
		if err != nil {
			log.Fatalf("Failed to add hash_pass column: %v", err)
		}

		// Update existing users to set hash_pass from password
		rows, err := db.Query("SELECT id, password FROM users WHERE hash_pass IS NULL")
		if err != nil {
			log.Fatalf("Failed to query users: %v", err)
		}

		var userID int
		var password string
		for rows.Next() {
			if err := rows.Scan(&userID, &password); err != nil {
				log.Fatalf("Failed to scan user: %v", err)
			}
			
			if password != "" {
				hashedPassword := hashPassword(password)
				_, err = db.Exec("UPDATE users SET hash_pass = ? WHERE id = ?", hashedPassword, userID)
				if err != nil {
					log.Fatalf("Failed to update user hash_pass: %v", err)
				}
				fmt.Printf("Updated hash_pass for user ID %d\n", userID)
			}
		}
		rows.Close()
	}

	// Create a simple HTTP server
	http.HandleFunc("/api/v1/auth/register", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var req RegisterRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// Hash the password
		hashedPassword := hashPassword(req.Password)

		// Insert user into database with hash_pass
		result, err := db.Exec(
			"INSERT INTO users (email, name, password, hash_pass, role) VALUES (?, ?, ?, ?, ?)",
			req.Email, req.Name, req.Password, hashedPassword, req.Role,
		)
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to create user: %v", err), http.StatusInternalServerError)
			return
		}

		id, _ := result.LastInsertId()
		user := User{
			ID:    int(id),
			Email: req.Email,
			Name:  req.Name,
			Role:  req.Role,
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(user)
	})

	// Start the server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
} 