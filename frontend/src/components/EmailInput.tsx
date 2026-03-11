import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function EmailInput({ value, onChange, error }: EmailInputProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">
        Email Address
      </label>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="email"
          placeholder="you@company.com"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "h-11 w-full rounded-xl border bg-background/50 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent",
            error ? "border-error" : "border-border",
          )}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
    </div>
  );
}
