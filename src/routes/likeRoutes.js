// Defines URL paths for like actions

import express from "express";
const router = express.Router();
import { toggleLike, getLikeStatus } from "../controllers/likeController.js";
import authMiddleware from "../middleware/authMiddleware.js";

router.post("/:id/like", authMiddleware, toggleLike);
router.get("/:id/like", getLikeStatus);

export default router;