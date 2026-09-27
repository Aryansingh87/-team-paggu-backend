import mongoose from "mongoose";

const membershipPlanSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true }, // e.g. "STARTER", "MB_BASIC"
    category: {
      type: String,
      enum: ["POWERLIFTING", "MUSCLE_BUILDING", "FAT_LOSS", "BODY_TRANSFORMATION"],
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true }, // in INR, smallest currency unit handled at payment time
    period: { type: String, default: "month" },
    durationMonths: { type: Number, default: 1 },
    description: { type: String },
    features: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("MembershipPlan", membershipPlanSchema);