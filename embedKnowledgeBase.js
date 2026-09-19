import "dotenv/config";
import connectDB from "./config/db.js";
import KnowledgeChunk from "./models/KnowledgeChunk.js";
import knowledgeBase from "./data/knowledgeBase.js";
import { embedText } from "./config/voyage.js";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * One-time (or re-run-whenever-you-edit-the-KB) script that embeds every
 * entry in data/knowledgeBase.js via Voyage AI and stores it in MongoDB.
 * Run with: npm run embed-kb
 *
 * Paced at ~21 seconds between requests to stay under Voyage's free-tier
 * rate limit (3 requests/minute without a payment method on file) — this
 * means the full run takes a few minutes, which is expected.
 */
async function run() {
  await connectDB();

  console.log(`Embedding ${knowledgeBase.length} knowledge base entries...`);
  console.log("(Paced to stay under Voyage's free-tier rate limit — this will take a few minutes.)");

  for (const entry of knowledgeBase) {
    const embedding = await embedText(entry.text, "document");

    await KnowledgeChunk.findOneAndUpdate(
      { chunkId: entry.id },
      { chunkId: entry.id, title: entry.title, text: entry.text, embedding },
      { upsert: true, new: true }
    );

    console.log(`  ✓ ${entry.title}`);
    await sleep(21000);
  }

  console.log("Knowledge base embedding complete.");
  process.exit(0);
}

run().catch((err) => {
  console.error("Embedding failed:", err);
  process.exit(1);
});