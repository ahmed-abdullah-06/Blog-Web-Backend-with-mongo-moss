import Comment from "../models/comment.js";

async function getCommentsForPost(req, res) {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate("authorId", "name")
      .sort({ createdAt: 1 });

    const shaped = comments.map((c) => ({
      id: c._id,
      content: c.content,
      createdAt: c.createdAt,
      author: c.authorId ? { id: c.authorId._id, name: c.authorId.name } : null,
    }));

    res.json(shaped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong fetching comments" });
  }
}

async function addComment(req, res) {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Comment cannot be empty" });
    }

    const comment = await Comment.create({
      content,
      postId: req.params.postId,
      authorId: req.userId,
    });

    const populated = await comment.populate("authorId", "name");

    res.status(201).json({
      id: populated._id,
      content: populated.content,
      createdAt: populated.createdAt,
      author: { id: populated.authorId._id, name: populated.authorId.name },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong adding the comment" });
  }
}

async function deleteComment(req, res) {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    if (comment.authorId.toString() !== req.userId) {
      return res.status(403).json({ error: "You can only delete your own comments" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong deleting the comment" });
  }
}

export { getCommentsForPost, addComment, deleteComment };