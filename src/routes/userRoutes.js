// Defines URL paths for user profile actions

import express from "express";
const router = express.Router();
import { getUserProfile, updateProfile, changePassword } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

router.put("/me", authMiddleware, updateProfile);
router.put("/me/password", authMiddleware, changePassword);
router.get("/:id", getUserProfile);

export default router;