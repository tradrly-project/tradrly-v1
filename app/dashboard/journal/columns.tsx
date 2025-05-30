"use client"
import { ColumnDef } from "@tanstack/react-table"
import { TradeWithPair } from "@/lib/types"

export const columns: ColumnDef<TradeWithPair>[] = [
  {
    accessorKey: "closedAt",
    header: "Tanggal",
    cell: ({ row }) => {
      const date = new Date(row.getValue("closedAt") as string)
      return <div>{date.toLocaleDateString()}</div>
    },
  },
  {
    accessorKey: "pair.symbol",
    header: "Simbol",
    cell: ({ row }) => row.original.pair.symbol,
  },
  {
    accessorKey: "direction",
    header: "Posisi",
  },
  {
    accessorKey: "entryPrice",
    header: "Entry",
    cell: ({ row }) => parseFloat(row.getValue("entryPrice")).toFixed(2),
  },
  {
    accessorKey: "stoploss",
    header: "SL",
    cell: ({ row }) => parseFloat(row.getValue("stoploss")).toFixed(2),
  },
  {
    accessorKey: "takeProfit",
    header: "TP",
    cell: ({ row }) => parseFloat(row.getValue("takeProfit")).toFixed(2),
  },
  {
    accessorKey: "lotSize",
    header: "Lot",
  },
  {
    accessorKey: "exitPrice",
    header: "Exit",
    cell: ({ row }) => parseFloat(row.getValue("exitPrice")).toFixed(2),
  },
  {
    accessorKey: "result",
    header: "Result",
  },
  {
    accessorKey: "profitLoss",
    header: "P/L",
    cell: ({ row }) => `${parseFloat(row.getValue("profitLoss")).toFixed(2)}`,
  },
  {
    accessorKey: "riskRatio",
    header: "RR",
    cell: ({ row }) => parseFloat(row.getValue("riskRatio")).toFixed(2),
  },
  {
    accessorKey: "psychology",
    header: "Psychology",
  },
  {
    accessorKey: "strategi",
    header: "Strategi",
  },
]
