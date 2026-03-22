cat > README.md << 'EOF'
# AI Text Summarizer

## 1. Project Overview
AI Text Summarizer is a full-stack web app that takes unstructured text and returns a structured JSON summary using Claude AI. It extracts a one-sentence summary, three key points, and the overall sentiment.

## 2. Tech Stack
- Frontend: React 18 + Vite + Axios
- Backend: Node.js + Express
- LLM: Anthropic Claude Haiku (claude-haiku-3-5-20251001)
- Other: dotenv, cors

## 3. Setup Instructions
cd server && npm install
cd ../client && npm install
cp server/.env.example server/.env

## 4. How to Run
Terminal 1: cd server && npm start
Terminal 2: cd client && npm run dev
Visit: http://localhost:5173

## 5. LLM API Choice
Claude Haiku is fast, cheap, and follows strict formatting instructions perfectly.

## 6. Prompt Design
Strict role definition, JSON-only output, explicit constraints on each field to prevent hallucination.

## 7. Known Trade-offs
No auth, no rate limiting, no streaming, no persistence.

## 8. What I Would Add
Retry logic, copy-to-clipboard, localStorage history, unit tests.

## 9. Example Output
Input: "NASA's Artemis program aims to return humans to the Moon by 2026."
Output: { "summary": "...", "keyPoints": [...], "sentiment": "positive" }
EOF