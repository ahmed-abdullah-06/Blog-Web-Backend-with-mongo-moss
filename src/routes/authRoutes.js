// Defines URL paths for auth-related actions

import express from "express";
const router = express.Router();
import { signup, login, requestPasswordReset, resetPassword } from "../controllers/authController.js";

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);

export default router;