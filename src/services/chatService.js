import pool from "../db/db.index.js";

export async function saveMessage({
  sessionId,
  role,
  content,
  sql = null,
  data = null,
}) {
  await pool.query(
    `
    INSERT INTO conversations
    (session_id, role, content, sql_query, data)
    VALUES ($1, $2, $3, $4, $5)
    `,
    [sessionId, role, content, sql, data]
  );
}

export async function getConversation(
  sessionId
) {
  const result = await pool.query(
    `
    SELECT *
    FROM conversations
    WHERE session_id = $1
    ORDER BY created_at ASC
    `,
    [sessionId]
  );

  return result.rows;
}