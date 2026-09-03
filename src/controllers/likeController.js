import Like from "../models/like.js";

async function toggleLike(req, res) {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    const existingLike = await Like.findOne({ postId, userId });

    if (existingLike) {
      await existingLike.deleteOne();
    } else {
      await Like.create({ postId, userId });
    }

    const likeCount = await Like.countDocuments({ postId });
    const liked = !existingLike;

    res.json({ liked, likeCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong toggling the like" });
  }
}

async function getLikeStatus(req, res) {
  try {
    const postId = req.params.id;
    const likeCount = await Like.countDocuments({ postId });

    let liked = false;
    if (req.userId) {
      const existingLike = await Like.findOne({ postId, userId: req.userId });
      liked = Boolean(existingLike);
    }

    res.json({ liked, likeCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong fetching like status" });
  }
}

export { toggleLike, getLikeStatus };