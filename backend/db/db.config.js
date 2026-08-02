import mysql from "mysql2/promise";

/**
 * Creates a MySQL connection pool using environment variables.
 * Connection pools reuse existing connections instead of
 * opening a new one for every query, improving performance.
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST,       // Database server hostname
  user: process.env.DB_USER,       // Database username
  password: process.env.DB_PASSWORD, // Database password
  database: process.env.DB_NAME,   // Target database name
});

// Export the pool for use throughout the application
export default pool;
