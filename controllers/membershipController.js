import MembershipPlan from "../models/MembershipPlan.js";

// GET /api/memberships — public, matches the pricing tiers on the frontend
export async function getPlans(req, res) {
  const plans = await MembershipPlan.find().sort({ price: 1 });
  res.json({ plans });
}
