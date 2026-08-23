import mongoose from "mongoose";

// One row in the coach's program spreadsheet for a client.
const exerciseRowSchema = new mongoose.Schema(
  {
    day: { type: String, default: "" },     // e.g. "Day 1", "Monday"
    lift: { type: String, required: true }, // e.g. "Squat"
    sets: { type: String, default: "" },    // e.g. "5"
    reps: { type: String, default: "" },    // e.g. "3"
    weight: { type: String, default: "" },  // e.g. "82%" or "140kg"
    rpe: { type: String, default: "" },     // e.g. "8"
    notes: { type: String, default: "" },   // e.g. "Pause 1s at depth"
  },
  { _id: false }
);

const programSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    coach: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    weekLabel: { type: String, required: true }, // e.g. "Week of Aug 18"
    rows: [exerciseRowSchema],
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

// Fast lookup: "give me this client's most recent program"
programSchema.index({ client: 1, createdAt: -1 });

export default mongoose.model("Program", programSchema);