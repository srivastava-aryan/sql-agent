export function cleanSQL(rawSQL) {
  if (!rawSQL) return "";

  let cleaned = rawSQL
    .replace(/```sql/g, "")
    .replace(/```/g, "")
    .trim();

  // Remove explanations before SELECT
  const selectIndex = cleaned.toUpperCase().indexOf("SELECT");

  if (selectIndex !== -1) {
    cleaned = cleaned.substring(selectIndex);
  }

  // Keep query till semicolon
  const semicolonIndex = cleaned.indexOf(";");

  if (semicolonIndex !== -1) {
    cleaned = cleaned.substring(0, semicolonIndex + 1);
  }

  return cleaned.trim();
}

export function isSafeQuery(sql) {
  const forbidden = ["DROP", "DELETE", "TRUNCATE", "ALTER", "UPDATE"];

  const upperSQL = sql.toUpperCase();

  return !forbidden.some((word) => upperSQL.includes(word));
}

//This code defines two utility functions for handling SQL queries:
//1. cleanSQL: This function takes a raw SQL string, removes any markdown formatting (like ```sql), trims whitespace, and extracts only the first query if multiple queries are present.
//2. isSafeQuery: This function checks if the SQL query contains any potentially dangerous keywords (like DROP, DELETE, etc.) and returns false if it does, indicating that the query is not safe to execute.
