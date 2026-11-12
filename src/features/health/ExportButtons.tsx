import { useState } from "react";
import { exportData, type ExportFormat } from "../../lib/exportData";

// Errors can be Error objects (Supabase) or plain text (Tauri plugins)
function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) return String(error.message);
  return String(error);
}

export function ExportButtons() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleExport(format: ExportFormat) {
    setBusy(true);
    setMessage(null);
    try {
      const path = await exportData(format);
      if (path !== null) {
        const fileName = path.split(/[\\/]/).pop();
        setMessage(`Saved ${fileName}`);
      }
    } catch (error) {
      setMessage(`Export failed: ${errorMessage(error)}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ml-auto flex flex-wrap items-center gap-2">
      <p role="status" className="text-sm text-ink-soft">
        {busy ? "Exporting..." : message}
      </p>
      <button
        type="button"
        disabled={busy}
        onClick={() => handleExport("csv")}
        className="rounded-2xl bg-card px-3 py-1.5 font-semibold hover:bg-card-soft disabled:opacity-60"
      >
        Export CSV
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => handleExport("json")}
        className="rounded-2xl bg-card px-3 py-1.5 font-semibold hover:bg-card-soft disabled:opacity-60"
      >
        Full backup
      </button>
    </div>
  );
}