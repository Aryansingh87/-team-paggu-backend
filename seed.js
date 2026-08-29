import "dotenv/config";
import connectDB from "./config/db.js";
import MembershipPlan from "./models/MembershipPlan.js";
import User from "./models/User.js";

const plans = [
  {
    key: "STARTER",
    name: "Starter",
    price: 1999,
    period: "month",
    durationMonths: 1,
    description: "For lifters building the base.",
    features: ["Monthly program", "Form check (2 videos/wk)", "Chat — 48hr response", "Access to training log"],
  },
  {
    key: "COMPETITOR",
    name: "Competitor",
    price: 4999,
    period: "3 months",
    durationMonths: 3,
    description: "For lifters chasing a total.",
    features: [
      "Weekly program adjustments",
      "Form check (unlimited)",
      "Chat — 24hr response",
      "Meet-day planning",
      "Access to training log",
    ],
  },
  {
    key: "ELITE",
    name: "Elite",
    price: 9999,
    period: "6 months",
    durationMonths: 6,
    description: "For lifters going to nationals.",
    features: [
      "Daily program adjustments",
      "Form check + live calls",
      "Chat — same day",
      "Meet-day + peaking cycle",
      "1:1 monthly video call",
    ],
  },
];

async function seed() {
  await connectDB();

  for (const plan of plans) {
    await MembershipPlan.findOneAndUpdate({ key: plan.key }, plan, { upsert: true, new: true });
  }
  console.log(`Seeded ${plans.length} membership plans.`);

  const coachEmail = "coach@teampaggu.com";
  const existingCoach = await User.findOne({ email: coachEmail });
  if (!existingCoach) {
    await User.create({
      name: "Coach",
      email: coachEmail,
      password: "paggu1234",
      role: "coach",
    });
    console.log(`Seeded demo coach account: ${coachEmail} / paggu1234`);
  } else {
    console.log("Demo coach account already exists — skipped.");
  }

  console.log("Seeding complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});