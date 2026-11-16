# AI Code Reviewer

Paste code in Java, C, C++ or JavaScript and get an AI-powered review covering bugs, readability, performance and best practices.

**Live demo:** https://ai-code-reviewer-amber-six.vercel.app/

## Tech Stack
- **Frontend:** React, Vite, Prism (editor highlighting), react-markdown
- **Backend:** Node.js, Express, express-rate-limit
- **AI:** Google Gemini API

## Run locally

```bash
# Backend
cd AI-Code-Reviewer/Backend
cp .env.example .env        # then add your GOOGLE_GEMINI_KEY
npm install
npm start                   # http://localhost:3000

# Frontend (new terminal)
cd AI-Code-Reviewer/Frontend
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173
```

Get a Gemini key at https://aistudio.google.com/apikey.

## Environment variables

| Where | Name | Purpose |
|-------|------|---------|
| Backend | `GOOGLE_GEMINI_KEY` | Gemini API key |
| Backend | `FRONTEND_URL` | Allowed frontend origin(s) for CORS, comma-separated |
| Backend | `PORT` | Set automatically by most hosts |
| Frontend | `VITE_API_URL` | Public URL of the backend |

## Deployment
- Backend: Render web service (root `AI-Code-Reviewer/Backend`, build `npm install`, start `npm start`)
- Frontend: Vercel (root `AI-Code-Reviewer/Frontend`, framework Vite)

The API is rate limited to 10 requests per minute per IP.
