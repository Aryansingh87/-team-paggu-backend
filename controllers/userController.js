import User from "../models/User.js";

// GET /api/users/clients  (coach only) — full client roster for the dashboard
export async function getClients(req, res) {
  const clients = await User.find({ role: "client" }).sort({ createdAt: -1 });
  res.json({ clients });
}

// GET /api/users/coach  (any logged-in user) — returns the team's coach account.
// Team Paggu has a single coach, so this just returns the first coach found.
// If you ever support multiple coaches, this should instead return the coach
// assigned to the logged-in client.
export async function getCoach(req, res) {
  const coach = await User.findOne({ role: "coach" });
  if (!coach) {
    return res.status(404).json({ message: "No coach account found." });
  }
  res.json({ coach });
}
