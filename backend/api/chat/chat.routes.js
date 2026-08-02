import express from "express";
import {
  createConversationController,
  getConversationsController,
} from "./controller/chat.controller.js";

// Create a router for chat-related endpoints
const chatRouter = express.Router();

// POST /api/chat/conversations — Create a new conversation (user sends a question)
chatRouter.post("/conversations", createConversationController);

// GET /api/chat/conversations — Fetch recent conversation history
chatRouter.get("/conversations", getConversationsController);

// Export the chat router to be mounted in main.routes.js
export default chatRouter;
