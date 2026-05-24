import express from "express";
import pool from "../db/db.index.js";
import { generateSQL } from "../services/aiService.js";
import { isSafeQuery, cleanSQL } from "../utils/sqlUtils.js";
import { getMemory, addToMemory } from "../utils/memory.js";
import { repairSQL } from "../services/repairService.js";
import { saveMessage, getConversation } from "../services/chatService.js";
import { getDatabaseSchema } from "../services/schemaService.js";
import { createSession, getSessions } from "../services/sessionService.js";

const router = express.Router();

router.post("/query", async (req, res) => {
  const { question, sessionId } = req.body;
  if (!sessionId) {
    return res.status(400).json({ error: "sessionId required" });
  }
  const existing = await pool.query(
    `
  SELECT * FROM chat_sessions
  WHERE id = $1
  `,
    [sessionId],
  );

  if (existing.rows.length === 0) {
    await createSession(sessionId, question.slice(0, 30));
  }

  console.log("[queryRoutes] Question received:", question);
  await saveMessage({
    sessionId,
    role: "user",
    content: question,
  });

  try {
    const rawSQL = await generateSQL(question, sessionId);

    let sql = cleanSQL(rawSQL);

    console.log("Clean SQL:", sql);
    if (!isSafeQuery(sql)) {
      return res.status(400).json({
        error: "Unsafe query detected",
        sql,
      });
    }
    // const result = await pool.query(sql);
    let result;

    try {
      result = await pool.query(sql);
    } catch (error) {
      console.log("❌ SQL Failed:", error.message);

      const repairedSQL = await repairSQL({
        question,
        failedSQL: sql,
        errorMessage: error.message,
        schema: await getDatabaseSchema(),
      });

      console.log("🛠️ Repaired SQL:", repairedSQL);

      sql = cleanSQL(repairedSQL);
      result = await pool.query(sql);
    }
    await saveMessage({
      sessionId,
      role: "assistant",
      content: "Query executed successfully.",
      sql,
      data: JSON.stringify(result.rows),
    });

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

router.get("/history/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    const messages = await getConversation(sessionId);

    res.json(messages);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch history",
    });
  }
});

router.get("/sessions", async (req, res) => {
  try {
    const sessions = await getSessions();

    res.json(sessions);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch sessions",
    });
  }
});

export default router;

//This file defines the API endpoint for handling natural language queries.
//It receives a question from the client, uses the generateSQL function to convert it into a SQL query,
//executes that query against the PostgreSQL database using the pool instance, and returns both the generated SQL
//and the query results back to the client.
