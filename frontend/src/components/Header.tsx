import { BarChart3 } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
            <BarChart3 className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              Sales Insight Automator
            </h1>
            <p className="text-xs text-muted">by Keshav Nakra</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Online
          </span>
        </div>
      </div>
    </header>
  );
}
