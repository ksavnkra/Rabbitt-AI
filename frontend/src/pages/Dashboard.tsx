import { Header } from "@/components/Header";
import { UploadCard } from "@/components/UploadCard";
import { SummaryPreview } from "@/components/SummaryPreview";
import { useUpload } from "@/hooks/useUpload";

export function Dashboard() {
  const {
    file,
    email,
    status,
    summary,
    errorMessage,
    setFile,
    setEmail,
    submit,
    reset,
  } = useUpload();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Glow effect */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <main className="relative mx-auto max-w-2xl px-6 py-12">
        {/* Hero */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            AI-Powered Sales Analysis
          </h2>
          <p className="mt-3 text-base text-muted">
            Upload your sales data and get an instant executive summary
            delivered to your inbox.
          </p>
        </div>

        {/* Upload Card */}
        <UploadCard
          file={file}
          email={email}
          status={status}
          errorMessage={errorMessage}
          onFileSelect={setFile}
          onEmailChange={setEmail}
          onSubmit={submit}
          onReset={reset}
        />

        {/* Summary */}
        {summary && (
          <div className="mt-8">
            <SummaryPreview summary={summary} />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-xs text-muted">
          <p>Sales Insight Automator &mdash; Built by Keshav Nakra</p>
        </footer>
      </main>
    </div>
  );
}
