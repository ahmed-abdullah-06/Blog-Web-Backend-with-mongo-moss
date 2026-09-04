// Defines URL paths for post-related actions

import express from "express";
const router = express.Router();
import { createPost, getAllPosts, getPostById, updatePost, deletePost } from "../controllers/postController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

router.post("/", authMiddleware, upload.single("coverImage"), createPost);
router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.put("/:id", authMiddleware, upload.single("coverImage"), updatePost);
router.delete("/:id", authMiddleware, deletePost);

export default router;