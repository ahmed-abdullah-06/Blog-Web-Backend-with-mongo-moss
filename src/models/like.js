import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

// Prevents the same user liking the same post twice
likeSchema.index({ postId: 1, userId: 1 }, { unique: true });

export default mongoose.model("Like", likeSchema);