import { schema } from "../utils/schema.js";
import { getMemory } from "../utils/memory.js";
import { retrieveContext } from "./ragService.js";

export async function generateSQL(query, sessionId) {
  const context = await retrieveContext(query);
  const history = getMemory(sessionId)
    .map((msg) => `User: ${msg}`)
    .join("\n");
  const prompt = `
You are an expert SQL generator.

Database Schema:
${schema}

Business Context:
${context}

Conversation History:
${history}

Rules:
- Only generate SQL
- Do not explain anything
- Use only the tables and columns provided

User Query:
"${query}"
`;

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3",
      prompt,
      stream: false,
    }),
  });

  console.log(
    "[generateSQL] Ollama status:",
    response.status,
    response.statusText,
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[generateSQL] Ollama error body:", errorText);
    throw new Error(`Ollama request failed with status ${response.status}`);
  }
  const data = await response.json();
  console.log("[generateSQL] Ollama response data:", data);
  return data.response;
}

//This code defines the generateSQL function, which takes a natural language query as input,
//constructs a prompt for the Ollama API to convert it into a SQL query, and then makes a POST request to the Ollama API.
//It handles the response, checks for errors, and returns the generated SQL query.
