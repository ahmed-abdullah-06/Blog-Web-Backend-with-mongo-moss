import Message from "../models/message.js";
import User from "../models/user.js";

async function getConversations(req, res) {
  try {
    const userId = req.userId;
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).sort({ createdAt: -1 });

    const seen = new Set();
    const conversations = [];
    for (const msg of messages) {
      const otherId = msg.senderId.toString() === userId ? msg.receiverId.toString() : msg.senderId.toString();
      if (!seen.has(otherId)) {
        seen.add(otherId);
        const otherUser = await User.findById(otherId).select("name");
        if (otherUser) {
          conversations.push({
            user: { id: otherUser._id, name: otherUser.name },
            lastMessage: msg.content,
            lastMessageAt: msg.createdAt,
          });
        }
      }
    }
    res.json(conversations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong fetching conversations" });
  }
}

async function getThread(req, res) {
  try {
    const myId = req.userId;
    const otherId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: otherId },
        { senderId: otherId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.json(
      messages.map((m) => ({
        id: m._id,
        content: m.content,
        senderId: m.senderId.toString(),
        receiverId: m.receiverId.toString(),
        createdAt: m.createdAt,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong fetching messages" });
  }
}

async function sendMessage(req, res) {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }
    const message = await Message.create({
      content,
      senderId: req.userId,
      receiverId: req.params.userId,
    });
    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong sending the message" });
  }
}

export { getConversations, getThread, sendMessage };