import mongoose from "mongoose";

// Stores each knowledge-base entry along with its embedding vector, so we
// can compare a user's question against every chunk at query time without
// needing a separate vector database.
const knowledgeChunkSchema = new mongoose.Schema(
  {
    chunkId: { type: String, required: true, unique: true }, // matches the `id` in data/knowledgeBase.js
    title: { type: String, required: true },
    text: { type: String, required: true },
    embedding: { type: [Number], required: true },
  },
  { timestamps: true }
);

export default mongoose.model("KnowledgeChunk", knowledgeChunkSchema);