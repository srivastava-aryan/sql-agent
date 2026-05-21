import { ChromaClient } from "chromadb";

const client = new ChromaClient();

let collection;

export async function initRAG() {
  collection = await client.getOrCreateCollection({
    name: "sql_context",
  });
}

function ensureCollection() {
  if (!collection) {
    throw new Error("RAG collection is not initialized. Call initRAG() first.");
  }
}

export async function addDocuments() {
  await collection.add({
    ids: ["1", "2"],
    documents: [
      "Active users are users who logged in within the last 30 days.",
      "High value customers are those whose total spending is greater than 10000.",
    ],
  });
}

export async function retrieveContext(query) {
  const results = await collection.query({
    queryTexts: [query],
    nResults: 2,
  });

  return results.documents.flat().join("\n");
}