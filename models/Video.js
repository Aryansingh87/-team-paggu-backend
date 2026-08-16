import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lift: { type: String, enum: ["SQUAT", "BENCH", "DEADLIFT", "OTHER"], required: true },
    weight: { type: String, required: true }, // e.g. "180kg"
    videoUrl: { type: String, required: true }, // Cloudinary secure_url
    status: { type: String, enum: ["pending", "reviewed"], default: "pending" },
    coachNote: { type: String, default: "" },
  },
  { timestamps: true }
);

videoSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("Video", videoSchema);
