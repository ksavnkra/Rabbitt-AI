# Sales Insight Automator

**By Keshav Nakra — Rabbitt AI**

A secure, containerized application where a team member can upload a sales data file (CSV/Excel) and instantly trigger an AI-generated executive brief sent directly to their inbox.

---

## Architecture

```
frontend/   →  React SPA (Vite + TypeScript + TailwindCSS)
backend/    →  Node.js API (Express + TypeScript + Swagger)
```

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite 6, TailwindCSS 4, React Hook Form, Zod, Axios, Sonner |
| Backend | Express, TypeScript, Multer, Groq (Llama 3), Resend, Swagger/OpenAPI |
| CI/CD | GitHub Actions (lint + type-check + build on PR to main) |

---

## End-to-End Flow

1. User uploads `.csv` or `.xlsx` on the frontend
2. User enters a recipient email address
3. Frontend sends the file to `POST /api/analyze-sales` (multipart/form-data)
4. Backend validates the file (type, size, MIME) and parses the sales data
5. Groq AI (Llama 3) generates a professional executive summary
6. Summary is emailed to the recipient via the Resend API
7. Frontend displays the AI-generated summary with progressive loading states

---

## Running Locally

### With Docker (Recommended)

```bash
# 1. Make sure backend/.env exists with your API keys
cp backend/.env.example backend/.env
# Edit backend/.env and fill in GROQ_API_KEY and RESEND_API_KEY

# 2. Spin up the entire stack
docker-compose up --build
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Swagger Docs:** http://localhost:5000/api-docs

### Without Docker

#### Prerequisites

- Node.js 22+
- npm

### Backend

```bash
cd backend
cp .env.example .env
# Fill in GROQ_API_KEY and RESEND_API_KEY
npm install --legacy-peer-deps
npm run dev
```

Swagger docs available at: **http://localhost:5000/api-docs**

### Frontend

```bash
cd frontend
cp .env.example .env
# VITE_API_URL defaults to http://localhost:5000
npm install
npm run dev
```

App available at: **http://localhost:5173**

---

## Environment Configuration

### Backend (`backend/.env.example`)

```
PORT=5000
GROQ_API_KEY=          # Groq API key for Llama 3
RESEND_API_KEY=        # Resend API key for email delivery
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env.example`)

```
VITE_API_URL=http://localhost:5000
```

---

## Endpoint Security

Security is built into the core of the backend service:

1. **Helmet.js** — Secure HTTP headers to protect against common web vulnerabilities (XSS, clickjacking, MIME sniffing).
2. **CORS Policy** — Strict Cross-Origin Resource Sharing rules. Only the configured `FRONTEND_URL` origin is allowed.
3. **Rate Limiting** — IP-based rate limiting via `express-rate-limit` to prevent brute-force and DDoS abuse.
4. **File Validation** — Strict Multer configuration: 5 MB limit, dual-validation on file extension and MIME type. Only `.csv` and `.xlsx` are accepted. Malicious files are rejected before parsing.
5. **Memory Storage** — Uploaded files stay in memory buffers only during parsing and are never written to disk, preventing file system exploits.

---

## CI/CD

GitHub Actions workflows trigger on pushes and PRs to `main`:

| Workflow | Path | Steps |
|---|---|---|
| Backend CI | `.github/workflows/backend-ci.yml` | Install → Build → Type Check |
| Frontend CI | `.github/workflows/frontend-ci.yml` | Install → Type Check → Lint → Build |

---

## Test Data

A reference CSV is included at `backend/test/sample_sales.csv` for testing the upload flow.

---

## Project Structure

```
├── .github/workflows/
│   ├── backend-ci.yml
│   └── frontend-ci.yml
├── backend/
│   ├── src/
│   ├── test/sample_sales.csv
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── UploadCard.tsx
│   │   │   ├── FileDropzone.tsx
│   │   │   ├── EmailInput.tsx
│   │   │   ├── SummaryPreview.tsx
│   │   │   └── StatusIndicator.tsx
│   │   ├── pages/Dashboard.tsx
│   │   ├── services/api.ts
│   │   ├── hooks/useUpload.ts
│   │   ├── lib/utils.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── nginx.conf
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml
├── .gitignore
└── README.md
```
