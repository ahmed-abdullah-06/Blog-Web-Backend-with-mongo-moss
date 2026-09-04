import express from "express";
const router = express.Router();
import { getConversations, getThread, sendMessage } from "../controllers/messageController.js";
import authMiddleware from "../middleware/authMiddleware.js";

router.get("/conversations", authMiddleware, getConversations);
router.get("/:userId", authMiddleware, getThread);
router.post("/:userId", authMiddleware, sendMessage);

export default router;