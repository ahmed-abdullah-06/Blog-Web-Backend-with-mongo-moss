import User from "../models/user.js";
import Post from "../models/post.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";

async function getUserProfile(req, res) {
  try {
    const user = await User.findById(req.params.id).select("name email age gender createdAt");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await Post.find({ authorId: user._id }).sort({ createdAt: -1 });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      createdAt: user.createdAt,
      Posts: posts.map((p) => ({
        id: p._id,
        title: p.title,
        content: p.content,
        coverImageUrl: p.coverImageUrl,
        createdAt: p.createdAt,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong fetching the profile" });
  }
}

async function updateProfile(req, res) {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { name, age, gender } = req.body;
    if (name) user.name = name;
    if (age !== undefined) user.age = age;
    if (gender !== undefined) user.gender = gender;

    await user.save();

    res.json({ id: user._id, name: user.name, email: user.email, age: user.age, gender: user.gender });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong updating your profile" });
  }
}

async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new password are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong changing your password" });
  }
}

export { getUserProfile, updateProfile, changePassword };