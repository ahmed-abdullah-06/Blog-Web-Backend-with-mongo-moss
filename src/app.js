// Main Express application setup
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import { setupSwagger } from "./config/swagger.js";
import messageRoutes from "./routes/messageRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.get("/", (req, res) => {
  res.json({ message: "DevBlog API is running" });
});

setupSwagger(app);

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/posts", likeRoutes);
app.use("/api/users", userRoutes);
app.use("/api", commentRoutes);
app.use("/api/messages", messageRoutes);

app.use(errorHandler);

export default app;