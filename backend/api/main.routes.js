import express from "express";
import chatRouter from "./chat/chat.routes.js";

// Create the root API router
const mainRouter = express.Router();

// Mount chat-related routes under /api/chat
mainRouter.use("/chat", chatRouter);

// Export the main router to be mounted in app.js
export default mainRouter;
