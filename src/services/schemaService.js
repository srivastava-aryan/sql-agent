import pool from "../db/db.index.js";
import redisClient from "../config/redis.js";

export async function getDatabaseSchema() {
  const cachedSchema = await redisClient.get("db_schema");

  if (cachedSchema) {
    console.log("✅ Schema from Redis cache");
    return cachedSchema;
  }

  const query = `
    SELECT table_name, column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
    ORDER BY table_name, ordinal_position;
  `;

  const result = await pool.query(query);

  const grouped = {};

  result.rows.forEach((row) => {
    const { table_name, column_name, data_type } = row;

    if (!grouped[table_name]) {
      grouped[table_name] = [];
    }

    grouped[table_name].push(`${column_name} (${data_type})`);
  });

  let schemaText = "";

  for (const table in grouped) {
    schemaText += `Table: ${table}\n`;
    schemaText += `Columns:\n`;

    grouped[table].forEach((col) => {
      schemaText += `- ${col}\n`;
    });

    schemaText += "\n";
  }

  await redisClient.set("db_schema", schemaText);

  return schemaText;
}
