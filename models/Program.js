import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
  {
    lift: { type: String, required: true },
    sets: { type: String, required: true }, // e.g. "5x3 @ 82%"
    note: { type: String, default: "" },
  },
  { _id: false }
);

const programSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    coach: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    weekLabel: { type: String, required: true }, // e.g. "Week of Aug 4"
    exercises: [exerciseSchema],
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

// Fast lookup: "give me this client's most recent program"
programSchema.index({ client: 1, createdAt: -1 });

export default mongoose.model("Program", programSchema);
