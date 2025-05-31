"use client";
import { ColumnDef } from "@tanstack/react-table";
import { TradeWithPair } from "@/lib/types";

export const columns: ColumnDef<TradeWithPair>[] = [
  {
    accessorKey: "closedAt",
    header: () => <div className="min-w-[80px] bg-amber-300">Tanggal</div>,
    cell: ({ row }) => {
      const date = new Date(row.getValue("closedAt") as string);
      return <div className="min-w-[80px]">{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "pair.symbol",
    header: () => <div className="min-w-[80px] bg-red-400">Simbol</div>,
    cell: ({ row }) => (
      <div className="min-w-[80px]">{row.original.pair.symbol}</div>
    ),
  },
  {
    accessorKey: "direction",
    header: () => <div className="min-w-[70px] bg-amber-300">Posisi</div>,
    cell: ({ row }) => (
      <div className="min-w-[70px]">{row.getValue("direction")}</div>
    ),
  },

  {
    accessorKey: "entryPrice",
    header: () => <div className="min-w-[60px] bg-red-600">Entry</div>,
    cell: ({ row }) => (
      <div className="min-w-[60px]">
        {parseFloat(row.getValue("entryPrice")).toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "stoploss",
    header: () => <div className="min-w-[60px] bg-yellow-300">SL</div>,
    cell: ({ row }) => (
      <div className="min-w-[60px]">
        {parseFloat(row.getValue("stoploss")).toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "takeProfit",
    header: () => <div className="min-w-[60px] bg-blue-400">TP</div>,
    cell: ({ row }) => (
      <div className="min-w-[60px]">
        {parseFloat(row.getValue("takeProfit")).toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "lotSize",
    header: () => <div className="min-w-[40px] bg-amber-300">Lot</div>,
    cell: ({ row }) => (
      <div className="min-w-[50px]">{row.getValue("lotSize")}</div>
    ),
  },
  {
    accessorKey: "exitPrice",
    header: () => <div className="min-w-[60px] bg-red-400">Exit</div>,
    cell: ({ row }) => (
      <div className="min-w-[60px]">
        {parseFloat(row.getValue("exitPrice")).toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "result",
    header: () => <div className="min-w-[60px] bg-blue-400">Result</div>,
    cell: ({ row }) => (
      <div className="min-w-[60px]">{row.getValue("result")}</div>
    ),
  },
  {
    accessorKey: "profitLoss",
    header: () => <div className="min-w-[60px] bg-blue-400">P/L</div>,
    cell: ({ row }) => (
      <div className="min-w-[60px]">
        {parseFloat(row.getValue("profitLoss")).toFixed(2)}
      </div>
    ),
  },
  {
  id: "actions",
  header: () => <div className="w-[50px]" />, // tanpa teks
  cell: () => (
    <div className="flex justify-end w-[50px]">
      <button className="text-xs text-primary hover:underline">Edit</button>
    </div>
  ),
  enableSorting: false,
  enableHiding: false,
}

];
