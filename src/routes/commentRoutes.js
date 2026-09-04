// Defines URL paths for comment actions

import express from "express";
const router = express.Router();
import { getCommentsForPost, addComment, deleteComment } from "../controllers/commentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

router.get("/posts/:postId/comments", getCommentsForPost);
router.post("/posts/:postId/comments", authMiddleware, addComment);
router.delete("/comments/:id", authMiddleware, deleteComment);

export default router;