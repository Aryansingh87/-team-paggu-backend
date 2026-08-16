import mongoose from "mongoose";

const membershipPlanSchema = new mongoose.Schema(
  {
    key: { type: String, enum: ["STARTER", "COMPETITOR", "ELITE"], required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true }, // in INR, smallest currency unit handled at payment time
    period: { type: String, default: "month" },
    description: { type: String },
    features: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("MembershipPlan", membershipPlanSchema);
