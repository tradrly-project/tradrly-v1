import { Loader2 } from "lucide-react";

export default function LoadingSetupPage() {
  return (
    <div className="h-full p-4 flex flex-col gap-6 transition-all ease-in-out duration-800">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold mb-1">Setup Trade</h1>
      </div>

      {/* Spinner */}
      <div className="flex items-center gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    </div>
  );
}
