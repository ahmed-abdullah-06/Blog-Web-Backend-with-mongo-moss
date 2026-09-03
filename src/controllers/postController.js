import Post from "../models/post.js";

async function createPost(req, res) {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    let parsedTags = [];
    if (Array.isArray(tags)) {
      parsedTags = tags;
    } else if (typeof tags === "string" && tags.trim()) {
      parsedTags = tags.split(",").map((t) => t.trim()).filter(Boolean);
    }

    const coverImageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const post = await Post.create({
      title,
      content,
      tags: parsedTags,
      coverImageUrl,
      authorId: req.userId,
    });

    res.status(201).json({
      id: post._id,
      title: post.title,
      content: post.content,
      tags: post.tags,
      coverImageUrl: post.coverImageUrl,
      createdAt: post.createdAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong creating the post" });
  }
}

async function getAllPosts(req, res) {
  try {
    const { tag, q } = req.query;
    const filter = {};

    if (tag) {
      filter.tags = tag;
    }
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
      ];
    }

    const posts = await Post.find(filter)
      .populate("authorId", "name")
      .sort({ createdAt: -1 });

    // reshape so frontend's post.author.name still works unchanged
    const shaped = posts.map((p) => ({
      id: p._id,
      title: p.title,
      content: p.content,
      tags: p.tags,
      coverImageUrl: p.coverImageUrl,
      createdAt: p.createdAt,
      author: p.authorId ? { id: p.authorId._id, name: p.authorId.name } : null,
    }));

    res.json(shaped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong fetching posts" });
  }
}

async function getPostById(req, res) {
  try {
    const post = await Post.findById(req.params.id).populate("authorId", "name");

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({
      id: post._id,
      title: post.title,
      content: post.content,
      tags: post.tags,
      coverImageUrl: post.coverImageUrl,
      createdAt: post.createdAt,
      author: post.authorId ? { id: post.authorId._id, name: post.authorId.name } : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong fetching the post" });
  }
}

async function updatePost(req, res) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.authorId.toString() !== req.userId) {
      return res.status(403).json({ error: "You can only edit your own posts" });
    }

    const { title, content, tags } = req.body;
    if (title) post.title = title;
    if (content) post.content = content;
    if (tags !== undefined) {
      post.tags = Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim()).filter(Boolean);
    }
    if (req.file) {
      post.coverImageUrl = `/uploads/${req.file.filename}`;
    }
    post.updatedAt = new Date();

    await post.save();
    res.json({
      id: post._id,
      title: post.title,
      content: post.content,
      tags: post.tags,
      coverImageUrl: post.coverImageUrl,
      createdAt: post.createdAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong updating the post" });
  }
}

async function deletePost(req, res) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.authorId.toString() !== req.userId) {
      return res.status(403).json({ error: "You can only delete your own posts" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong deleting the post" });
  }
}

export { createPost, getAllPosts, getPostById, updatePost, deletePost };