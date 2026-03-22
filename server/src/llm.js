const { buildPrompt } = require("./prompt");

async function summarizeText(text) {
  const { system, user } = buildPrompt(text);

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.ANTHROPIC_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user }
        ],
        max_tokens: 500
      })
    }
  );

  const data = await response.json();

  if (!data.choices || !data.choices[0]) {
    throw new Error("No response from Groq: " + JSON.stringify(data));
  }

  const rawText = data.choices[0].message.content;

  let parsed;
  try {
    const clean = rawText.replace(/```json|```/g, "").trim();
    parsed = JSON.parse(clean);
  } catch (e) {
    throw new Error("Model returned invalid JSON");
  }

  return parsed;
}

module.exports = { summarizeText };
