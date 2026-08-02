import db from "../../../db/db.config.js";
import { GoogleGenAI } from "@google/genai";

// Gemini API configuration from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

// Warn at startup if API key is missing
if (!GEMINI_API_KEY || GEMINI_API_KEY === "your_gemini_api_key") {
  console.error("ERROR: GEMINI_API_KEY is not set in .env file!");
  console.error("Get your API key from: https://aistudio.google.com/apikey");
}

// Initialize the Gemini AI client
const geminiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

/**
 * System instruction that restricts the AI to software engineering topics only.
 */
const SYSTEM_INSTRUCTION = `You are an expert software engineering assistant. Your primary role is to help developers write, debug, and understand code.
# Core Objectives
- Provide accurate, practical, and efficient programming solutions.
- Explain technical concepts clearly and concisely.

# Constraints & Boundaries
- STRICTLY limit your answers to software engineering, programming, computer science, and IT-related topics.
- If a user asks about non-programming topics, you MUST politely decline and steer the conversation.
- Do not write harmful, malicious, or unethical code.

# Tone & Style
- Be professional, helpful, and direct.
- Keep responses concise; avoid unnecessary fluff.
- Use Markdown formatting for readability.
- Always wrap code snippets in appropriate language-specific code blocks.`;

/**
 * Creates a new conversation turn:
 * 1. Validates the user's question
 * 2. Loads recent conversation history for context
 * 3. Saves the user message to the database
 * 4. Generates an AI assistant reply using Gemini
 * 5. Saves the assistant reply to the database
 * 6. Returns the full history and assistant answer
 */
const createConversationService = async (question) => {
  if (!question || !question.trim()) {
    const error = new Error("Question is required");
    error.status = 400;
    throw error;
  }

  if (!GEMINI_API_KEY || GEMINI_API_KEY === "your_gemini_api_key") {
    const error = new Error("Gemini API key is not configured. Please set GEMINI_API_KEY in .env file");
    error.status = 500;
    throw error;
  }

  // Fetch recent conversation history to provide context to the AI
  const historyRows = await getRecentConversationsRows();

  // Insert the user's message into the database
  await db.execute(
    "INSERT INTO conversations (role, content) VALUES (?, ?)",
    ["user", question],
  );

  // Generate the AI assistant's reply using Gemini with conversation history
  const { text, totalTokens } = await generateAssistantAnswer(historyRows, question);

  // Save the assistant's reply to the database
  await db.execute(
    "INSERT INTO conversations (role, content, token_count) VALUES (?, ?, ?)",
    ["assistant", text, totalTokens],
  );

  // Return the conversation history and the assistant's answer
  return { historyRows, assistantAnswer: text };
};

/**
 * Sends the conversation history and current question to the Gemini API.
 * Includes retry logic with exponential backoff for temporary 503 errors.
 */
const generateAssistantAnswer = async (historyRows, question) => {
  const MAX_RETRIES = 3;
  const INITIAL_RETRY_DELAY = 2000;

  // Convert database rows into Gemini's expected format
  const formatHistory = historyRows.map((row) => ({
    role: row.role === "assistant" ? "model" : "user",
    parts: [{ text: row.content }],
  }));

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const chat = geminiClient.chats.create({
        model: GEMINI_MODEL,
        config: {
          maxOutputTokens: 1000,
          systemInstruction: SYSTEM_INSTRUCTION,
        },
        history: formatHistory,
      });

      const result = await chat.sendMessage({ message: question });
      const text = result.text || "";
      const totalTokens = result.usageMetadata?.totalTokenCount || 0;

      return { text, totalTokens };
    } catch (error) {
      // Retry on model overloaded errors (503)
      const isOverloadedError =
        error.status === 503 ||
        error.message?.includes("503") ||
        error.message?.includes("UNAVAILABLE") ||
        error.message?.includes("high demand");

      if (isOverloadedError && attempt < MAX_RETRIES) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      throw error;
    }
  }
};

/**
 * Fetches the most recent conversation rows from the database.
 * @param {number} limit - Max rows to return (default: 20)
 */
const getRecentConversationsRows = async (limit) => {
  const normalizedLimit = Number.parseInt(limit, 10);
  const safeLimit =
    Number.isNaN(normalizedLimit) || normalizedLimit <= 0
      ? 20
      : normalizedLimit;

  const [rows] = await db.execute(
    "SELECT * FROM conversations ORDER BY created_at DESC LIMIT ?",
    [safeLimit],
  );
  return rows.reverse();
};

export { createConversationService, getRecentConversationsRows };
