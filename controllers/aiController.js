import ai from "../config/gemini.js";
import { embedText } from "../config/voyage.js";
import { cosineSimilarity } from "../utils/cosineSimilarity.js";
import KnowledgeChunk from "../models/KnowledgeChunk.js";
const MODEL = "gemini-2.5-flash";

// Schema Gemini must follow — matches the Program model's `rows` shape
// exactly, so the output can be dropped straight into the coach's grid.
const programSchema = {
  type: "object",
  properties: {
    rows: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "string" },
          lift: { type: "string" },
          sets: { type: "string" },
          reps: { type: "string" },
          weight: { type: "string" },
          rpe: { type: "string" },
          notes: { type: "string" },
        },
        required: ["day", "lift", "sets", "reps"],
      },
    },
  },
  required: ["rows"],
};

// POST /api/ai/generate-program  (coach only)
// body: { goal, experienceLevel, currentMaxes, daysPerWeek }
export async function generateProgramDraft(req, res) {
  const { goal, experienceLevel, currentMaxes, daysPerWeek } = req.body;

  if (!goal || !experienceLevel || !daysPerWeek) {
    return res.status(400).json({ message: "goal, experienceLevel, and daysPerWeek are required." });
  }

  const prompt = `You are an experienced powerlifting coach writing a training program.

Client details:
- Goal: ${goal}
- Experience level: ${experienceLevel}
- Current estimated maxes: ${currentMaxes || "not provided"}
- Training days per week: ${daysPerWeek}

Write a ONE WEEK training program covering squat, bench press, and deadlift
(plus sensible accessory work), split across the given number of days.
Use "day" values like "Day 1", "Day 2", etc. Use realistic sets/reps/weight
(weight can be a %1RM like "75%" or an RPE-based note if maxes aren't given).
Keep notes short and coaching-specific (form cues, tempo, etc), not generic.`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: programSchema,
    },
  });

  const data = JSON.parse(response.text);
  res.json({ rows: data.rows });
}

// POST /api/ai/ask  (any logged-in user)
// body: { question }
export async function askCoachBot(req, res) {
  const { question } = req.body;

  if (!question || !question.trim()) {
    return res.status(400).json({ message: "question is required." });
  }

  // 1. Embed the question
  const questionEmbedding = await embedText(question, "query");

  // 2. Retrieve the most relevant knowledge base chunks (brute-force —
  // fine at this scale, no vector DB needed for ~15-20 documents)
  const allChunks = await KnowledgeChunk.find({});
  const ranked = allChunks
    .map((chunk) => ({
      chunk,
      score: cosineSimilarity(questionEmbedding, chunk.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const context = ranked
    .map((r) => `### ${r.chunk.title}\n${r.chunk.text}`)
    .join("\n\n");

  // 3. Generate an answer grounded in that retrieved context
  const prompt = `Context from the coaching knowledge base:\n\n${context}\n\nQuestion: ${question}`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      systemInstruction:
        "You are a helpful powerlifting coaching assistant for Team Paggu. " +
        "Answer ONLY using the provided context. Keep answers concise and practical. " +
        "If the context doesn't contain the answer, say so honestly rather than guessing. " +
        "For anything about pain, injury, or medical concerns, tell the user to message their real coach directly " +
        "and see a medical professional — do not attempt to diagnose or give medical advice.",
    },
  });

  res.json({
    answer: response.text,
    sources: ranked.map((r) => r.chunk.title),
  });
}