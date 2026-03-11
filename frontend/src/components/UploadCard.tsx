import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sparkles, RotateCcw } from "lucide-react";
import { FileDropzone } from "./FileDropzone";
import { EmailInput } from "./EmailInput";
import { StatusIndicator, type UploadStatus } from "./StatusIndicator";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

interface UploadCardProps {
  file: File | null;
  email: string;
  status: UploadStatus;
  errorMessage: string;
  onFileSelect: (file: File | null) => void;
  onEmailChange: (email: string) => void;
  onSubmit: () => Promise<void>;
  onReset: () => void;
}

export function UploadCard({
  file,
  email,
  status,
  errorMessage,
  onFileSelect,
  onEmailChange,
  onSubmit,
  onReset,
}: UploadCardProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const handleEmailChange = useCallback(
    (value: string) => {
      onEmailChange(value);
      setValue("email", value, { shouldValidate: true });
    },
    [onEmailChange, setValue],
  );

  const isProcessing = ["uploading", "analyzing", "generating", "sending"].includes(status);
  const isDone = status === "success";

  const onFormSubmit = handleSubmit(async () => {
    await onSubmit();
  });

  // Register email for validation
  register("email");

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-2xl shadow-black/20">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          Upload Sales Data
        </h2>
        <p className="mt-1 text-sm text-muted">
          Upload your .csv or .xlsx file and receive an AI-powered executive
          summary
        </p>
      </div>

      <form onSubmit={onFormSubmit} className="space-y-5">
        <FileDropzone file={file} onFileSelect={onFileSelect} />

        <EmailInput
          value={email}
          onChange={handleEmailChange}
          error={errors.email?.message}
        />

        {status !== "idle" && (
          <StatusIndicator status={status} errorMessage={errorMessage} />
        )}

        <div className="flex gap-3 pt-1">
          {isDone || status === "error" ? (
            <button
              type="button"
              onClick={onReset}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:bg-border transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Start Over
            </button>
          ) : (
            <button
              type="submit"
              disabled={!file || !email || isProcessing}
              className={cn(
                "flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all",
                !file || !email || isProcessing
                  ? "cursor-not-allowed bg-accent/30 text-accent-foreground/50"
                  : "bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/25 active:scale-[0.98]",
              )}
            >
              {isProcessing ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent-foreground/30 border-t-accent-foreground" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate AI Sales Brief
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
