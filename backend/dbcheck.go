package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

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

	// Get table schema
	rows, err := db.Query("SELECT sql FROM sqlite_master WHERE type='table' AND name='users'")
	if err != nil {
		log.Fatalf("Failed to query schema: %v", err)
	}
	defer rows.Close()

	var schema string
	if rows.Next() {
		if err := rows.Scan(&schema); err != nil {
			log.Fatalf("Failed to scan schema: %v", err)
		}
		fmt.Println("Users table schema:")
		fmt.Println(schema)
	} else {
		fmt.Println("Users table not found")
	}

	// Check if hash_pass column exists
	rows, err = db.Query("PRAGMA table_info(users)")
	if err != nil {
		log.Fatalf("Failed to query table info: %v", err)
	}
	defer rows.Close()

	fmt.Println("\nColumns in users table:")
	var id, notnull, pk int
	var name, colType, dflt_value string
	for rows.Next() {
		if err := rows.Scan(&id, &name, &colType, &notnull, &dflt_value, &pk); err != nil {
			log.Fatalf("Failed to scan column info: %v", err)
		}
		fmt.Printf("Column: %s, Type: %s, NotNull: %d\n", name, colType, notnull)
	}
} 