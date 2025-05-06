import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import Farm from "./src/models/Farms.js";

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for JSON
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "dist")));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("Error connecting to MongoDB:", error));

// API Routes
app.get("/api", (req, res) => {
  res.send("API is running...");
});

// POST route to add a new farm
app.post("/api/farms", async (req, res) => {
  try {
    const { user, name, address, additionalInfo } = req.body;
    const newFarm = new Farm({
      user,
      name,
      address,
      additionalInfo,
    });
    await newFarm.save();
    res.status(201).json({ message: "Farm created successfully" });
  } catch (error) {
    console.error("Error creating farm:", error);
    res.status(500).json({ message: "Error creating farm" });
  }
});

// For any request that doesn't match one above, send the index.html file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
