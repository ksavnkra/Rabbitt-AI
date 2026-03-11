import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type UploadStatus =
  | "idle"
  | "uploading"
  | "analyzing"
  | "generating"
  | "sending"
  | "success"
  | "error";

interface StatusIndicatorProps {
  status: UploadStatus;
  errorMessage?: string;
}

const STATUS_CONFIG: Record<
  UploadStatus,
  { label: string; color: string; step: number }
> = {
  idle: { label: "", color: "", step: 0 },
  uploading: { label: "Uploading file...", color: "text-accent", step: 1 },
  analyzing: {
    label: "Analyzing sales data...",
    color: "text-accent",
    step: 2,
  },
  generating: {
    label: "Generating executive summary...",
    color: "text-accent",
    step: 3,
  },
  sending: { label: "Sending email...", color: "text-accent", step: 4 },
  success: { label: "Complete!", color: "text-success", step: 5 },
  error: { label: "Something went wrong", color: "text-error", step: 0 },
};

const STEPS = ["Upload", "Analyze", "Generate", "Email"];

export function StatusIndicator({
  status,
  errorMessage,
}: StatusIndicatorProps) {
  if (status === "idle") return null;

  const config = STATUS_CONFIG[status];

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="flex gap-1.5">
        {STEPS.map((step, i) => (
          <div key={step} className="flex-1 space-y-1">
            <div className="h-1.5 rounded-full bg-card overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-700 ease-out",
                  config.step > i + 1
                    ? "w-full bg-success"
                    : config.step === i + 1
                      ? "w-1/2 bg-accent animate-pulse"
                      : "w-0",
                  status === "success" && "w-full bg-success",
                  status === "error" && config.step > i && "bg-error",
                )}
              />
            </div>
            <p className="text-[10px] text-muted text-center">{step}</p>
          </div>
        ))}
      </div>

      {/* Status message */}
      <div className="flex items-center justify-center gap-2">
        {status === "success" ? (
          <CheckCircle2 className="h-4 w-4 text-success" />
        ) : status === "error" ? (
          <AlertCircle className="h-4 w-4 text-error" />
        ) : (
          <Loader2 className="h-4 w-4 animate-spin text-accent" />
        )}
        <p className={cn("text-sm font-medium", config.color)}>
          {config.label}
        </p>
      </div>

      {status === "error" && errorMessage && (
        <p className="text-center text-xs text-error/80">{errorMessage}</p>
      )}
    </div>
  );
}
