import express from "express";
import pool from "../db/db.index.js";
import { generateSQL } from "../services/aiService.js";
import { isSafeQuery, cleanSQL } from "../utils/sqlUtils.js";
import { getMemory, addToMemory } from "../utils/memory.js";

const router = express.Router();

router.post("/query", async (req, res) => {
  const { question, sessionId } = req.body;
  if (!sessionId) {
    return res.status(400).json({ error: "sessionId required" });
  }

  console.log("[queryRoutes] Question received:", question);

  try {
    const rawSQL = await generateSQL(question, sessionId);

    const sql = cleanSQL(rawSQL);

    console.log("Clean SQL:", sql);
    if (!isSafeQuery(sql)) {
      return res.status(400).json({
        error: "Unsafe query detected",
        sql,
      });
    }
    const result = await pool.query(sql);

    addToMemory(sessionId, question);
    res.json({
      sql,
      data: result.rows,
    });
    console.log("[queryRoutes] SQL generated:", sql);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

//This file defines the API endpoint for handling natural language queries.
//It receives a question from the client, uses the generateSQL function to convert it into a SQL query,
//executes that query against the PostgreSQL database using the pool instance, and returns both the generated SQL
//and the query results back to the client.
