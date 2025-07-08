"use client";

import { useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { DataTable } from "./data-table";
import { getColumns } from "./columns";
import * as DialogPrimitive from "@radix-ui/react-dialog";
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
import { Loader2, XIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchJournalData } from "@/lib/api/journal";
import { useSession } from "next-auth/react";

export default function JournalClient() {
  const { state } = useSidebar();
  const sidebarWidth = state === "collapsed" ? "6rem" : "16rem";
  const [filter, setFilter] = useState("");

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data, error, isLoading } = useQuery({
    queryKey: ["journal-data", userId],
    queryFn: fetchJournalData,
    enabled: !!userId,
  });

  if (isLoading) {
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

  if (error || !data) {
    return null;
  }

  const { journals, pairs, setupTrade, userPsychologies } = data;

  const columns = getColumns(pairs, setupTrade, userPsychologies);

  const filteredJournals = journals.filter((journal) => {
    const pair = journal.pair?.pair?.symbol?.toLowerCase() || "";
    const result = journal.result?.toLowerCase() || "";
    const direction = journal.direction?.toLowerCase() || "";
    const keyword = filter.toLowerCase();

    return (
      pair.includes(keyword) ||
      result.includes(keyword) ||
      direction.includes(keyword)
    );
  });

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
          className="max-w-[200px] focus-visible:ring-[2px] border-zinc-700"
        />

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-700 cursor-pointer hover:bg-foreground/10 hover:text-foreground"
            >
              <PlusIcon className="mr-1 h-4 w-4" /> Jurnal
            </Button>
          </DialogTrigger>

          <DialogContent
            className="p-0 rounded-3xl overflow-y-auto"
            style={{ height: "90vh" }}
            showCloseButton={false}
          >
            <div className="flex flex-col min-h-full">
              {/* Sticky Header */}
              <div className="sticky top-0 z-50 bg-background py-4 px-4 w-full">
                <div className="flex justify-between items-center">
                  <DialogTitle className="text-2xl font-bold text-white">
                    Tambah Jurnal
                  </DialogTitle>
                  <DialogPrimitive.Close asChild>
                    <button className="cursor-pointer text-white">
                      <XIcon className="w-5 h-5" />
                    </button>
                  </DialogPrimitive.Close>
                </div>
                <DialogDescription className="text-white/90 mt-1" />
              </div>

              {/* Scrollable Content */}
              <div className="px-4 pb-6 space-y-4">
                <TradeForm userPairs={pairs} setupTrades={setupTrade} />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabel */}
      <DataTable columns={columns} data={filteredJournals} />
    </div>
  );
}
