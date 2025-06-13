"use client";

import { useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { TradeWithPair } from "@/lib/types";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
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

  const [filter, setFilter] = useState("");

  // Filter berdasarkan entryPrice, bisa disesuaikan ke kolom lain
  const filteredTrades = trades.filter((trade) =>
    trade.entryPrice.toString().toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div
      className="h-full p-4 transition-all ease-in-out duration-400"
      style={{ width: `calc(100vw - ${sidebarWidth})` }}
    >
      <h1 className="text-2xl font-semibold mb-4">Jurnal Trade</h1>

      {/* Baris atas: Input pencarian + Tombol Jurnal */}
      <div className="flex items-center justify-between py-4 gap-2">
        <Input
          placeholder="Cari Trade..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-[200px] focus-visible:ring-[2px]"
        />

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="cursor-pointer">
              <PlusIcon className="mr-1 h-4 w-4" /> Jurnal
            </Button>
          </DialogTrigger>

          <DialogContent
            className="max-h-[90vh] overflow-y-auto pb-10 px-2 rounded-3xl pt-0"
            showCloseButton={false}
          >
            {/* Sticky Header */}
            <div className="sticky top-0 z-50 bg-background px-7.5 pt-6 pb-4 mb-5 -mx-10">
              <div className="flex justify-between items-center">
                <DialogTitle className="text-2xl font-bold text-white">Tambah Jurnal</DialogTitle>
                <DialogPrimitive.Close asChild>
                  <button className="cursor-pointer text-white">
                    <XIcon className="w-5 h-5" />
                  </button>
                </DialogPrimitive.Close>
              </div>
              <DialogDescription className="text-white/90 mt-1" />
            </div>

            {/* Form Content */}
            <TradeForm pairs={pairs} />
          </DialogContent>
        </Dialog>

      </div>

      {/* Tabel */}
      <DataTable
        columns={columns}
        data={filteredTrades}
        filterValue={filter}
        onFilterChange={setFilter}
      />
    </div>
  );
}
