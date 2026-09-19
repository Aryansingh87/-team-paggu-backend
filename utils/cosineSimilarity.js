/**
 * cosineSimilarity — measures how close two embedding vectors are in
 * meaning (1 = identical direction/meaning, 0 = unrelated, -1 = opposite).
 * This is the core of retrieval in RAG: embed the user's question, then
 * rank every knowledge-base chunk by how similar its embedding is to it.
 */
export function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}