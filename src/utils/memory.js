const memoryStore = {};

export function addToMemory(sessionId, message) {
  if (!memoryStore[sessionId]) {
    memoryStore[sessionId] = [];
  }

  memoryStore[sessionId].push(message);

  // Keep last 5 messages only (avoid context overflow)
  if (memoryStore[sessionId].length > 5) {
    memoryStore[sessionId].shift();
  }
}

export function getMemory(sessionId) {
  return memoryStore[sessionId] || [];
}

//This code defines a simple in-memory storage mechanism for session-based messages. It provides two functions:
//1. addToMemory: This function takes a sessionId and a message, and stores the message in an array associated with that sessionId. It also ensures that only the last 5 messages are kept to prevent context overflow.
//2. getMemory: This function retrieves the array of messages associated with a given sessionId, or returns an empty array if no messages are found for that sessionId.