import dotenv from "dotenv";
dotenv.config();
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "ai_agent",
  password: process.env.DB_PASSWORD,
  port: 5432,
});

export default pool;

//This code sets up a connection pool to a PostgreSQL database using the pg library.