// const memoryStore = {};

// export function addToMemory(sessionId, message) {
//   if (!memoryStore[sessionId]) {
//     memoryStore[sessionId] = [];
//   }

//   memoryStore[sessionId].push(message);
//   console.log(`[Memory] Added message to session ${sessionId}. Current memory:`, memoryStore[sessionId]);

//   // Keep last 5 messages only (avoid context overflow)
//   if (memoryStore[sessionId].length > 5) {
//     memoryStore[sessionId].shift();
//   }
// }

// export function getMemory(sessionId) {
//   return memoryStore[sessionId] || [];
// }

import redisClient from "../config/redis.js";

export async function addToMemory(sessionId, message) {
  const key = `memory:${sessionId}`;

  await redisClient.rPush(key, message);

  // Keep only last 5 messages
  await redisClient.lTrim(key, -5, -1);
}

export async function getMemory(sessionId) {
  const key = `memory:${sessionId}`;

  return await redisClient.lRange(key, 0, -1);
}

//This code defines a simple in-memory storage mechanism for session-based messages. It provides two functions:
//1. addToMemory: This function takes a sessionId and a message, and stores the message in an array associated with that sessionId. It also ensures that only the last 5 messages are kept to prevent context overflow.
//2. getMemory: This function retrieves the array of messages associated with a given sessionId, or returns an empty array if no messages are found for that sessionId.

// The original implementation used a plain JavaScript object to store messages in memory, which would be lost if the server restarts. The updated implementation uses Redis,
// a persistent key-value store, to ensure that messages are retained even if the server restarts. Each session's messages are stored as a list in Redis,
// and the functions interact with Redis to add and retrieve messages.
