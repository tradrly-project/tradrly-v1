"use client";
import { ColumnDef } from "@tanstack/react-table";
import { TradeWithPair } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { TradeDetailDialog } from "@/components/journal/detail";

const formatUSD = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);

type Pair = {
  id: string;
  symbol: string;
};

type SetupTrade = {
  id: string;
  name: string;
};

type Psychology = { id: string; name: string };

export function getColumns(
  pairs: Pair[],
  setupTrades: SetupTrade[],
  allPsychologies: Psychology[]
): ColumnDef<TradeWithPair>[] {
  return [
  {
    accessorKey: "date",
    header: () => <div className="text-center px-3 py-2">Tanggal</div>,
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return (
        <div className="text-left px-3 py-2">
          {date && !isNaN(date.getTime())
            ? date.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "pair.symbol",
    header: () => <div className="text-center px-3 py-2">Simbol</div>,
    cell: ({ row }) => (
      <div className="text-left px-3 py-2">{row.original.pair.symbol}</div>
    ),
  },
  {
    accessorKey: "direction",
    header: () => <div className="text-center px-2 py-2">Posisi</div>,
    cell: ({ row }) => {
      const direction = row.getValue("direction") as string;
      const formatted = direction === "buy" ? "Buy" : "Sell";
      const isBuy = direction === "buy";

      return (
        <div className="text-center">
          <Badge
            className={
              isBuy ? "bg-sky-500 text-white" : "bg-red-500 text-white"
            }
          >
            {formatted}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "entryPrice",
    header: () => <div className="text-center px-2 py-2">Entry</div>,
    cell: ({ row }) => {
      const value = parseFloat(row.getValue("entryPrice"));
      const formatted = formatUSD(value).replace("$", ""); // ambil angka aja

      return (
        <div className="flex justify-between px-2 py-2">
          <span className="text-muted-foreground">$</span>
          <span className="text-right w-full">{formatted}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "takeProfit",
    header: () => <div className="text-center px-2 py-2">TP</div>,
    cell: ({ row }) => {
      const value = parseFloat(row.getValue("takeProfit"));
      const formatted = formatUSD(value).replace("$", "");

      return (
        <div className="flex justify-between px-2 py-2">
          <span className="text-muted-foreground">$</span>
          <span className="text-right w-full">{formatted}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "stoploss",
    header: () => <div className="text-center px-2 py-2">SL</div>,
    cell: ({ row }) => {
      const value = parseFloat(row.getValue("stoploss"));
      const formatted = formatUSD(value).replace("$", "");

      return (
        <div className="flex justify-between px-2 py-2">
          <span className="text-muted-foreground">$</span>
          <span className="text-right w-full">{formatted}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "exitPrice",
    header: () => <div className="text-center px-2 py-2">Exit</div>,
    cell: ({ row }) => {
      const value = parseFloat(row.getValue("exitPrice"));
      const formatted = formatUSD(value).replace("$", "");

      return (
        <div className="flex justify-between px-2 py-2">
          <span className="text-muted-foreground">$</span>
          <span className="text-right w-full">{formatted}</span>
        </div>
      );
    },
  },
  {
    id: "setupTradeName", // gunakan `id` untuk custom field
    header: () => <div className="text-center px-2 py-2">Setup</div>,
    cell: ({ row }) => {
      const name = row.original.setupTrade?.name;

      return (
        <div className="flex justify-center px-2 py-2">
          <Badge variant="default" className="text-xs px-2 py-1 m-0">
            {name ?? "-"}
          </Badge>
        </div>
      );
    },
  },

  {
    accessorKey: "result",
    header: () => <div className="text-center px-2 py-2">Result</div>,
    cell: ({ row }) => {
      const result = row.getValue("result") as string;
      const formatted = result.toUpperCase();

      let colorClass = ""; // default: no class
      if (result === "win") colorClass = "bg-sky-500 text-white";
      else if (result === "loss") colorClass = "bg-red-500 text-white";
      // BEP: no custom class (uses Badge default)

      return (
        <div className="text-center">
          <Badge className={colorClass}>{formatted}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "profitLoss",
    header: () => <div className="text-center px-2 py-2">P/L</div>,
    cell: ({ row }) => {
      const value = parseFloat(row.getValue("profitLoss"));
      const formatted = formatUSD(value).replace("$", "");

      return (
        <div className="flex justify-between px-2 py-2">
          <span className="text-muted-foreground">$</span>
          <span className="text-right w-full">{formatted}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center px-2 py-2"/>,
    cell: ({ row }) => {
      const trade = row.original;
      return (
        <div className="flex justify-center px-2 py-2">
          <TradeDetailDialog
            trade={{ ...trade, screenshots: trade.screenshots ?? [] }}
            pairs={pairs}
            setupTrades={setupTrades}
            allPsychologies={allPsychologies}            
          />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
}