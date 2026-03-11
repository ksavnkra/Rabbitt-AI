# The Engineer's Log: Sales Insight Automator

## Overview
This repository contains the backend service for the Sales Insight Automator, built as a production-ready, secure API. It accepts CSV/Excel sales data, parses it to extract key business metrics, generates an executive summary using the Groq AI engine (Llama 3), and delivers the report via email using the Resend API.

## Endpoints Secured
Security is built into the core of the service:
1. **Helmet.js**: Injected secure HTTP headers to protect against common web vulnerabilities.
2. **CORS Policy**: Strict Cross-Origin Resource Sharing rules to prevent unauthorized frontends from abusing the API.
3. **Rate Limiting**: IP-based rate limiting using `express-rate-limit` to prevent brute-force attacks and DDOS.
4. **File Validation**: Strict Multer configuration. We limit files to 5MB, and perform dual-validation on both file extension and MIME type to ensure only valid `.csv` or `.xlsx` files enter the memory buffer. Malicious files are rejected before parsing begins.
5. **Memory Storage**: Uploaded files stay in memory buffers during parsing and are never written to disk, preventing local file system exploits.

## Running the Stack
*(Note: Docker configuration was omitted as per instructions, but here is how to run the Node.js application locally)*

1. Navigate to the `backend/` directory.
2. Copy `.env.example` to `.env` and fill in your API keys (Groq and Resend).
3. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. View the interactive Swagger API documentation at: `http://localhost:5000/api-docs`

## Environment Configuration
See the included `.env.example` file for all required API keys and configuration values.
