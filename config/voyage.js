async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * embedText — gets a Voyage AI embedding for a piece of text.
 * inputType should be "document" when embedding knowledge-base content,
 * or "query" when embedding a user's question — Voyage optimizes each
 * differently for retrieval quality.
 *
 * Includes automatic retry on rate-limit (429) errors, since Voyage's free
 * tier without a payment method on file is capped at 3 requests/minute.
 */
export async function embedText(text, inputType = "document", retries = 3) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch("https://api.voyageai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
      },
      body: JSON.stringify({
        input: [text],
        model: "voyage-3.5",
        input_type: inputType,
      }),
    });

    if (res.status === 429 && attempt < retries) {
      console.log("  Rate limited — waiting 21s before retrying...");
      await sleep(21000);
      continue;
    }

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Voyage embedding request failed: ${res.status} ${errText}`);
    }

    const data = await res.json();
    return data.data[0].embedding;
  }

  throw new Error("Voyage embedding failed after multiple retries.");
}