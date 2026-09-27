import MembershipPlan from "../models/MembershipPlan.js";

// GET /api/memberships — public, returns all plans across every category,
// sorted so each category's tiers appear cheapest-first
export async function getPlans(req, res) {
  const plans = await MembershipPlan.find().sort({ category: 1, price: 1 });
  res.json({ plans });
}