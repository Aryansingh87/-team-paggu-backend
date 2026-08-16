import jwt from "jsonwebtoken";
import Message from "../models/Message.js";
import User from "../models/User.js";

/**
 * Real-time chat over Socket.io.
 *
 * Client connects with: io(url, { auth: { token: "<JWT>" } })
 * Events:
 *   - "send_message"  { to, text }   -> persists + emits "receive_message" to both users
 *   - "receive_message" (from server) { _id, from, to, text, createdAt }
 *
 * Each user joins a room named after their own user ID, so messages route
 * to them regardless of which tab/device they're connected from.
 */
export default function registerChatSocket(io) {
  // Auth middleware for socket connections — verifies the same JWT used for REST calls
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("No auth token provided"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return next(new Error("User not found"));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();
    socket.join(userId);
    console.log(`Socket connected: ${socket.user.name} (${userId})`);

    socket.on("send_message", async ({ to, text }) => {
      if (!to || !text || !text.trim()) return;

      const message = await Message.create({
        from: socket.user._id,
        to,
        text: text.trim(),
      });

      // Deliver to both the recipient and back to the sender (for multi-tab sync)
      io.to(to).emit("receive_message", message);
      io.to(userId).emit("receive_message", message);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.user.name} (${userId})`);
    });
  });
}
