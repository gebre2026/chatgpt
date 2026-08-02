import {
  createConversationService,
  getRecentConversationsRows,
} from "../service/chat.service.js";

/**
 * POST /api/chat/conversations
 * Receives a user question, delegates to the service layer,
 * and returns the created conversation as JSON.
 */
async function createConversationController(req, res) {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        status: false,
        message: "Question is required",
      });
    }

    const conversation = await createConversationService(question);

    res.status(201).json({
      status: true,
      data: conversation,
      message: "Conversation created successfully",
    });
  } catch (err) {
    res.status(err.status || 500).json({
      status: false,
      message: err.message || "Failed to process your request",
    });
  }
}

/**
 * GET /api/chat/conversations
 * Fetches the most recent conversation messages from the database.
 */
async function getConversationsController(req, res) {
  try {
    const limit = 1000;
    const conversations = await getRecentConversationsRows(limit);

    res.status(200).json({
      status: true,
      data: conversations,
      message: "Conversations fetched successfully",
    });
  } catch (err) {
    res.status(err.status || 500).json({
      status: false,
      message: err.message || "Failed to fetch conversations",
    });
  }
}

export { createConversationController, getConversationsController };
