import ollama from "ollama";

export async function repairSQL({
  question,
  failedSQL,
  errorMessage,
  schema,
}) {
  const prompt = `
You are a PostgreSQL SQL repair assistant.

Database Schema:
${schema}

User Question:
${question}

Failed SQL:
${failedSQL}

Database Error:
${errorMessage}

Fix the SQL query.

Rules:
- Only return corrected PostgreSQL SQL
- No explanations
- No markdown
`;

  const response = await ollama.generate({
    model: "llama3",
    prompt,
  });

  return response.response.trim();
}