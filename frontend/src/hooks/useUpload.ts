import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { analyzeSales, parseApiError, type AnalyzeResponse } from "@/services/api";
import type { UploadStatus } from "@/components/StatusIndicator";

interface UseUploadReturn {
  file: File | null;
  email: string;
  status: UploadStatus;
  summary: string;
  errorMessage: string;
  setFile: (file: File | null) => void;
  setEmail: (email: string) => void;
  submit: () => Promise<void>;
  reset: () => void;
}

export function useUpload(): UseUploadReturn {
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [summary, setSummary] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const abortRef = useRef(false);

  const simulateProgress = useCallback(async () => {
    const stages: UploadStatus[] = [
      "uploading",
      "analyzing",
      "generating",
      "sending",
    ];
    for (const stage of stages) {
      if (abortRef.current) return;
      setStatus(stage);
      await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));
    }
  }, []);

  const submit = useCallback(async () => {
    if (!file || !email) return;

    abortRef.current = false;
    setErrorMessage("");
    setSummary("");

    const progressPromise = simulateProgress();

    try {
      const [response] = await Promise.all([
        analyzeSales(file, email),
        progressPromise,
      ]) as [AnalyzeResponse, unknown];

      if (response.status === "success") {
        setStatus("success");
        setSummary(response.summary);
        toast.success("Summary generated and email sent!");
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (err) {
      abortRef.current = true;
      setStatus("error");
      const message = parseApiError(err);
      setErrorMessage(message);
      toast.error(message);
    }
  }, [file, email, simulateProgress]);

  const reset = useCallback(() => {
    abortRef.current = true;
    setFile(null);
    setEmail("");
    setStatus("idle");
    setSummary("");
    setErrorMessage("");
  }, []);

  return {
    file,
    email,
    status,
    summary,
    errorMessage,
    setFile,
    setEmail,
    submit,
    reset,
  };
}
