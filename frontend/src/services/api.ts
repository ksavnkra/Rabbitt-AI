import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  timeout: 120_000,
});

export interface AnalyzeResponse {
  status: string;
  summary: string;
}

interface ApiErrorBody {
  message?: string;
  error?: string;
}

export function parseApiError(err: unknown): string {
  if (err instanceof AxiosError) {
    // Server responded with an error status
    if (err.response) {
      const status = err.response.status;
      const body = err.response.data as ApiErrorBody | undefined;
      const serverMsg = body?.message || body?.error;

      if (status === 400) return serverMsg || "Invalid request. Please check your file and email.";
      if (status === 413) return "File is too large. Please upload a smaller file.";
      if (status === 415) return "Unsupported file format. Please upload a .csv or .xlsx file.";
      if (status === 422) return serverMsg || "Could not process the file. Ensure it contains valid sales data.";
      if (status === 429) return "Too many requests. Please wait a moment and try again.";
      if (status === 500) return serverMsg || "Server error. Please try again later.";
      if (status === 502 || status === 503) return "Server is temporarily unavailable. Please try again later.";
      return serverMsg || `Server error (${status}). Please try again.`;
    }

    // No response received
    if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
      return "Request timed out. The server took too long to respond.";
    }
    if (err.message?.includes("Network Error")) {
      return "Cannot reach the server. Please check your connection or ensure the backend is running.";
    }
    if (err.message?.includes("CORS")) {
      return "Cross-origin request blocked. The backend may not be configured to accept requests from this origin.";
    }

    return err.message || "A network error occurred.";
  }

  if (err instanceof Error) {
    return err.message;
  }

  return "An unexpected error occurred. Please try again.";
}

export async function analyzeSales(
  file: File,
  email: string,
): Promise<AnalyzeResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("email", email);

  const response = await api.post<AnalyzeResponse>(
    "/api/analyze-sales",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );

  return response.data;
}
