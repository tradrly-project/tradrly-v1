"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "@heroicons/react/24/solid";

import { SetupTradeWithPair } from "@/lib/types";

export const columns: ColumnDef<SetupTradeWithPair>[] = [
  {
    accessorKey: "name",
    header: () => <div className="text-left px-3 py-2">Nama Setup</div>,
    cell: ({ row }) => <div className="px-3 py-2">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "strategy",
    header: () => <div className="text-left px-3 py-2">Strategi</div>,
    cell: ({ row }) => <div className="px-3 py-2">{row.getValue("strategy")}</div>,
  },
  {
    id: "pairs",
    header: () => <div className="text-center px-3 py-2">Simbol</div>,
    cell: ({ row }) => {
      const pairs = row.original.pairs;
      const label = pairs.length > 0
        ? pairs.map((p) => p.symbol).join(", ")
        : "Semua Pair"; // jika pairs kosong, asumsikan untuk semua

      return <div className="text-left px-3 py-2">{label}</div>;
    },
  },
  {
    accessorKey: "timeframe",
    header: () => <div className="text-left px-3 py-2">Timeframe</div>,
    cell: ({ row }) => <div className="px-3 py-2">{row.getValue("timeframe")}</div>,
  },
  {
    accessorKey: "rrRatio",
    header: () => <div className="text-center px-2 py-2">RR</div>,
    cell: ({ row }) => (
      <div className="text-center font-medium text-muted-foreground">
        {row.getValue("rrRatio")}
      </div>
    ),
  },
  {
    accessorKey: "checklist",
    header: () => <div className="text-left px-3 py-2">Checklist</div>,
    cell: ({ row }) => {
      const list: string[] = row.getValue("checklist") || [];
      return (
        <div className="flex flex-wrap gap-1 px-3 py-2">
          {list.length > 0 ? list.map((item, i) => (
            <Badge key={i} className="text-xs bg-muted border text-muted-foreground">
              {item}
            </Badge>
          )) : <span className="text-muted-foreground italic">-</span>}
        </div>
      );
    },
  },
  {
    accessorKey: "notes",
    header: () => <div className="text-left px-3 py-2">Catatan</div>,
    cell: ({ row }) => (
      <div className="px-3 py-2 text-muted-foreground">
        {row.getValue("notes") || <span className="italic">-</span>}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center px-2 py-2" />,
    cell: () => (
      <div className="flex justify-end px-2 py-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0 cursor-pointer">
          <EyeIcon className="h-4 w-4" />
        </Button>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
