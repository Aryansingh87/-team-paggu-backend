import mongoose from "mongoose";

const membershipPlanSchema = new mongoose.Schema(
  {
    key: { type: String, enum: ["STARTER", "COMPETITOR", "ELITE"], required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true }, // in INR, smallest currency unit handled at payment time
    period: { type: String, default: "month" }, // display text, e.g. "month" or "3 months"
    durationMonths: { type: Number, default: 1 }, // actual number of months this plan grants access for
    description: { type: String },
    features: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("MembershipPlan", membershipPlanSchema);