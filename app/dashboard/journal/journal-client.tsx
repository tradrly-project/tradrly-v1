"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { TradeWithPair } from "@/lib/types";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import TradeForm from "@/components/journal/form";

interface JournalClientProps {
  trades: TradeWithPair[];
  pairs: { id: string; symbol: string }[];
}

export default function JournalClient({ trades, pairs }: JournalClientProps) {
  const { state } = useSidebar();
  const sidebarWidth = state === "collapsed" ? "6rem" : "16rem";

  return (
    <div
      className="h-full p-4 transition-all ease-in-out duration-400"
      style={{ width: `calc(100vw - ${sidebarWidth})` }}
    >
      <h1 className="text-2xl font-semibold mb-4">Jurnal Trade</h1>

      <div className="flex items-center justify-between py-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="cursor-pointer">
              <PlusIcon className="mr-1 h-4 w-4" /> Jurnal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Jurnal Trade</DialogTitle>
              <DialogDescription />
            </DialogHeader>
            <TradeForm pairs={pairs} />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable columns={columns} data={trades} />
    </div>
  );
}
