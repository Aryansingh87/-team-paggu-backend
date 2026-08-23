import Program from "../models/Program.js";
import User from "../models/User.js";

// POST /api/programs  (coach only)
// body: { clientId, weekLabel, rows: [{day, lift, sets, reps, weight, rpe, notes}], notes }
export async function assignProgram(req, res) {
  const { clientId, weekLabel, rows, notes } = req.body;

  if (!clientId || !weekLabel || !Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ message: "clientId, weekLabel, and at least one row are required." });
  }

  // Drop any fully-blank rows the coach left in the grid — only rows with an
  // exercise name filled in count as real program entries.
  const validRows = rows.filter((r) => r.lift && r.lift.trim());
  if (validRows.length === 0) {
    return res.status(400).json({ message: "Every row needs at least an exercise name filled in." });
  }

  const client = await User.findById(clientId);
  if (!client || client.role !== "client") {
    return res.status(404).json({ message: "Client not found." });
  }

  const program = await Program.create({
    client: clientId,
    coach: req.user._id,
    weekLabel,
    rows: validRows,
    notes: notes || "",
  });

  res.status(201).json({ program });
}

// GET /api/programs/me  (client — their own most recent program)
export async function getMyLatestProgram(req, res) {
  const program = await Program.findOne({ client: req.user._id }).sort({ createdAt: -1 });
  if (!program) {
    return res.status(404).json({ message: "No program assigned yet." });
  }
  res.json({ program });
}

// GET /api/programs/client/:clientId  (coach — view a specific client's program history)
export async function getClientPrograms(req, res) {
  const programs = await Program.find({ client: req.params.clientId }).sort({ createdAt: -1 });
  res.json({ programs });
}