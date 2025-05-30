// journal-client.tsx
"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { TradeWithPair } from "@/lib/types";

interface JournalClientProps {
  trades: TradeWithPair[];
}

export default function JournalClient({ trades }: JournalClientProps) {
  const { state } = useSidebar();
  const sidebarWidth = state === "collapsed" ? "6rem" : "16rem";

  return (
    <div
      className="h-full p-4 transition-all ease-in-out duration-400"
      style={{ width: `calc(100vw - ${sidebarWidth})` }}
    >
      <h1 className="text-2xl font-semibold mb-4">Jurnal Trade</h1>
      <DataTable columns={columns} data={trades} />
    </div>
  );
}
