// Load environment variables from .env file into process.env
import "dotenv/config";

import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Database connection pool
import db from "./db/db.config.js";

// Centralized error handling middleware
import { errorHandler } from "./middleware/error-handler.js";

// Root router that prefixes all API endpoints with /api
import mainRouter from "./api/main.routes.js";

// Initialize Express application
const app = express();

// Use PORT from environment or default to 5000
const PORT = process.env.PORT || 5000;

// ES Modules __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse incoming JSON request bodies
app.use(express.json());

// Enable Cross-Origin Resource Sharing for all origins
app.use(cors());

// Parse URL-encoded request bodies (e.g., form submissions)
app.use(express.urlencoded({ extended: true }));

// Mount all API routes under /api prefix
app.use("/api", mainRouter);

// Serve frontend static files in production
app.use(express.static(join(__dirname, "public")));

// SPA fallback - serve index.html for non-API routes
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "public", "index.html"));
});

// Register error handler middleware (must be after routes)
app.use(errorHandler);

/**
 * Starts the server after verifying the database connection.
 */
async function startServer() {
  try {
    const connection = await db.getConnection();
    connection.release();
    console.log("Successfully connected to the database");
  } catch (error) {
    console.error("Error connecting DB (continuing):", error.message);
  }

  app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startServer();
