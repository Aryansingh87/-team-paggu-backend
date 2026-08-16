import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Fast lookup of a conversation between two users, oldest to newest
messageSchema.index({ from: 1, to: 1, createdAt: 1 });

export default mongoose.model("Message", messageSchema);
