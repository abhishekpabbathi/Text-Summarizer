function buildPrompt(text) {
  const system = `You are an assistant that converts unstructured text into a strict JSON summary. Return ONLY valid JSON — no markdown, no explanation, no code fences. The JSON must have exactly these keys:
{
  "summary": "one sentence describing the main point",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "sentiment": "positive | neutral | negative"
}
Rules: summary = exactly one sentence. keyPoints = exactly 3 short strings. sentiment = only one of the three allowed values.`;

  const user = `Analyze this text:\n\n${text}`;

  return { system, user };
}

module.exports = { buildPrompt };
