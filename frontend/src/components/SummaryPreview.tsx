import { FileText, Copy, Check } from "lucide-react";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface SummaryPreviewProps {
  summary: string;
}

export function SummaryPreview({ summary }: SummaryPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [summary]);

  if (!summary) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-accent" />
          <h3 className="text-sm font-semibold text-foreground">
            AI Executive Summary
          </h3>
        </div>
        <button
          onClick={handleCopy}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
            copied
              ? "bg-success/10 text-success"
              : "bg-card text-muted hover:text-foreground hover:bg-border",
          )}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </button>
      </div>
      <div className="rounded-lg bg-background/50 p-4">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
          {summary}
        </p>
      </div>
    </div>
  );
}
