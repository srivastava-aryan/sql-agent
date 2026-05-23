import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { OllamaEmbeddings } from "@langchain/ollama";

let vectorStore;

export async function initVectorStore() {
  const embeddings = new OllamaEmbeddings({
    model: "nomic-embed-text",
    baseUrl: "http://localhost:11434",
  });

  vectorStore = await MemoryVectorStore.fromTexts(
    [
      "Active users are users who logged in within the last 30 days.",
      "High value customers are customers with spending greater than 10000.",
      "Recent users are users created in the last 7 days.",
    ],
    [{ id: 1 }, { id: 2 }, { id: 3 }],
    embeddings
  );

  console.log("✅ Vector store initialized");
}

export async function retrieveContext(query) {
  const results = await vectorStore.similaritySearch(query, 2);

  return results.map((doc) => doc.pageContent).join("\n");
}