import { Loader2 } from "lucide-react";

export default function LoadingJournalPage() {
  return (
    <div className="h-full p-4 flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold mb-1">Jurnal Trade</h1>
      </div>

      {/* Spinner */}
      <div className="flex items-center gap-3 text-muted-foreground">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    </div>
  );
}
