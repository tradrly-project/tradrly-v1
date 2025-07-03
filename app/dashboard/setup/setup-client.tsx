"use client";

import { useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { DataTable } from "./data-table";
import { createSetupColumns } from "./columns";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import SetupTradeForm from "@/components/setup/form";
import { Loader2, XIcon } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSetupTrade, type SetupTradeResponse } from "@/lib/api/setup";

export default function SetupClient() {
  const queryClient = useQueryClient();
  const { state } = useSidebar();
  const sidebarWidth = state === "collapsed" ? "6rem" : "16rem";
  const [filter, setFilter] = useState("");

  const { data, error, isLoading } = useQuery<SetupTradeResponse>({
    queryKey: ["setup-trade"],
    queryFn: fetchSetupTrade,
  });

  if (isLoading) {
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

  if (error || !data) {
    return null;
  }

  const { setups, indicators, timeframes } = data;

  const filteredSetups = setups.filter((setup) => {
    const name = setup.name?.toLowerCase() || "";
    const strategy = setup.strategy?.toLowerCase() || "";
    const keyword = filter.toLowerCase();

    return name.includes(keyword) || strategy.includes(keyword);
  });

  return (
    <div
      className="h-full p-4 transition-all ease-in-out duration-400"
      style={{ width: `calc(100vw - ${sidebarWidth})` }}
    >
      <h1 className="text-2xl font-semibold mb-4">Setup Trade</h1>
      {/* Pencarian dan tombol tambah */}
      <div className="flex items-center justify-between py-4 gap-2">
        <Input
          placeholder="Cari Setup..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-[200px] focus-visible:ring-0 border-zinc-700"
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-700 cursor-pointer hover:bg-foreground/10 hover:text-foreground"
            >
              <PlusIcon className="mr-1 h-4 w-4" />
              Setup
            </Button>
          </DialogTrigger>

          <DialogContent className="w-[370px]" showCloseButton={false}>
            <div className="flex justify-between items-center mb-4">
              <DialogTitle className="text-2xl py-4">Setup Baru</DialogTitle>
              <DialogPrimitive.Close asChild>
                <button className="cursor-pointer text-white">
                  <XIcon className="w-5 h-5" />
                </button>
              </DialogPrimitive.Close>
            </div>
            <SetupTradeForm
              indicator={indicators}
              timeframe={timeframes}
              onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: ["setup-trade"] }); // ✅ Paksa refetch langsung
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabel Data Setup */}
      <DataTable
        columns={createSetupColumns({
          indicator: indicators,
          timeframe: timeframes,
        })}
        data={filteredSetups}
      />
    </div>
  );
}
