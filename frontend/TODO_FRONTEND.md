# TODO — Frontend Engineer (React)

You are the **Frontend Engineer** for the project **Sales Insight Automator by Keshav Nakra**.

Build a **production-quality Single Page Application (SPA)** that allows users to upload a sales data file and receive an AI-generated executive summary.

The UI must look **futuristic, modern, and enterprise-grade**.

---

# Tech Stack

Use:

React (Vite)
JavaScript
TailwindCSS
shadcn/ui
Axios
React Hook Form
Zod validation

The frontend will deploy on **Vercel**.

---

# Design Requirements

The interface should look like a **modern SaaS analytics dashboard**.

Design inspiration:

- Vercel dashboard
- Linear.app
- Stripe dashboard

Theme:

Dark mode default.

Colors:

Background: #0B0F19
Card: #111827
Accent: #6366F1
Success: #22C55E
Error: #EF4444

Animations:

- smooth hover states
- loading spinner
- progress animation

---

# Application Structure

Create this structure:

```
src/

components/
Header.tsx
UploadCard.tsx
FileDropzone.tsx
EmailInput.tsx
SummaryPreview.tsx
StatusIndicator.tsx

pages/
Dashboard.tsx

services/
api.ts

hooks/
useUpload.ts

App.tsx
main.tsx
```

---

# Core Feature

User workflow:

1 User uploads `.csv` or `.xlsx`
2 User enters email address
3 Click **Generate AI Summary**
4 Frontend sends file to backend API
5 Backend processes and returns summary
6 Email is sent to user
7 UI displays summary preview

---

# Upload Form

Fields:

File Upload

- drag & drop
- preview file name
- only accept `.csv` and `.xlsx`

Email Input

- validate email format

Button

Generate AI Sales Brief

---

# API Integration

Backend base URL from:

```
VITE_API_URL
```

Endpoint:

POST `/api/analyze-sales`

Request:

multipart/form-data

Fields:

file
email

---

# Example Response

```
{
  "status": "success",
  "summary": "Executive sales analysis text..."
}
```

Display summary in UI.

---

# Loading States

Show progressive messages:

Uploading file...
Analyzing sales data...
Generating executive summary...
Sending email...

---

# Error Handling

Handle:

Invalid file format
Server error
Email failure
Timeout

Show toast notification.

---

# Environment Variables

Create `.env.example`

Example:

```
VITE_API_URL=http://localhost:5000
```

---

# Code Quality

Enable:

ESLint
Prettier
TypeScript strict mode

---

# Performance

Lazy load components.
Avoid unnecessary re-renders.

---

# Deployment

Ensure project builds successfully:

```
npm run build
```

Deploy to **Vercel**.

---

# Deliverables

Frontend must include:

- Futuristic UI
- File upload system
- Email input
- API integration
- Loading indicators
- Error handling
- Summary preview
- .env.example

The final UI should look like a **premium AI SaaS dashboard**.
