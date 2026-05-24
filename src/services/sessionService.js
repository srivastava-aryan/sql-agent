import pool from "../db/db.index.js";

export async function createSession(
  sessionId,
  title
) {
  await pool.query(
    `
    INSERT INTO chat_sessions
    (id, title)
    VALUES ($1, $2)
    `,
    [sessionId, title]
  );
}

export async function getSessions() {
  const result = await pool.query(
    `
    SELECT *
    FROM chat_sessions
    ORDER BY created_at DESC
    `
  );

  return result.rows;
}