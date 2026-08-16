import Message from "../models/Message.js";

// GET /api/messages/:userId — full conversation between the logged-in user and :userId
export async function getConversation(req, res) {
  const otherUserId = req.params.userId;
  const meId = req.user._id;

  const messages = await Message.find({
    $or: [
      { from: meId, to: otherUserId },
      { from: otherUserId, to: meId },
    ],
  }).sort({ createdAt: 1 });

  res.json({ messages });
}

// POST /api/messages — fallback REST send (real-time delivery happens over Socket.io,
// see sockets/chatSocket.js — this endpoint just persists + is useful if sockets are down)
export async function sendMessage(req, res) {
  const { to, text } = req.body;
  if (!to || !text || !text.trim()) {
    return res.status(400).json({ message: "'to' and 'text' are required." });
  }

  const message = await Message.create({ from: req.user._id, to, text: text.trim() });
  res.status(201).json({ message });
}
