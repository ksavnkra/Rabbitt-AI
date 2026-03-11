# TODO — Backend Engineer (Node.js)

You are the **Backend Engineer** for the project **Sales Insight Automator by Keshav Nakra**.

Your job is to build a **secure API service** that processes uploaded sales data, generates an AI-powered summary, and emails the result.

The API must be **production-ready and secure**.

---

# Tech Stack

Node.js
Express.js
TypeScript

Libraries:

multer (file upload)
csv-parser
xlsx
nodemailer OR resend API
dotenv
swagger-ui-express
openai / gemini / groq sdk
helmet
express-rate-limit
cors

---

# Project Structure

Create:

```
backend/

src/

controllers/
salesController.ts

services/
aiService.ts
emailService.ts
dataService.ts

middlewares/
rateLimiter.ts
fileValidation.ts

routes/
salesRoutes.ts

config/
swagger.ts

app.ts
server.ts

.env.example
```

---

# API Endpoint

POST

```
/api/analyze-sales
```

Consumes:

multipart/form-data

Fields:

file (csv or xlsx)
email

---

# File Processing

Use:

csv-parser for CSV
xlsx for Excel

Extract metrics:

Total revenue
Total units sold
Best performing region
Best performing product category
Cancelled orders

Use the reference dataset format:

Date,Product_Category,Region,Units_Sold,Unit_Price,Revenue,Status

---

# AI Summary Generation

Send structured insights to LLM.

Use either:

Google Gemini API
or
Groq (Llama 3)

Prompt example:

Create a concise executive sales report using the following metrics and insights. The tone should be professional and suitable for company leadership.

The summary should contain:

Executive Summary
Key Highlights
Regional Performance
Product Performance
Operational Notes

---

# Email Delivery

Send generated summary to provided email.

Email subject:

Sales Insight Summary

Use:

Nodemailer or Resend API.

---

# Security

Implement:

Helmet for headers
CORS restrictions
Rate limiting:

5 requests per minute per IP

File validation:

Max size 5MB
Allow only CSV or XLSX

Reject malicious uploads.

---

# Swagger Documentation

Expose API docs:

```
/api-docs
```

Include:

Endpoint details
Request schema
Response schema
Example request

---

# Logging

Log:

Request received
File parsed
AI summary generated
Email sent

---

# Example API Response

```
{
  "status": "success",
  "summary": "Executive sales summary text..."
}
```

---

# Environment Variables

Create `.env.example`

Example:

```
PORT=5000
GEMINI_API_KEY=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
FRONTEND_URL=http://localhost:5173
```

---

# Deployment

Backend will deploy on **Render**.

Start command:

```
npm run start
```

Server should run on:

```
http://localhost:5000
```

---

# Deliverables

The backend must include:

* Express API
* Sales data parser
* AI summary generator
* Email sender
* Security middleware
* Swagger docs
* Clean modular architecture
* .env.example

The system must support:

Upload → Parse → AI Summary → Email.
