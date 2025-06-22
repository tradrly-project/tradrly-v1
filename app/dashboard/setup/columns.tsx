"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "@heroicons/react/24/solid";

import { SetupTrade } from "@prisma/client"; // atau tipe custom kamu

export const columns: ColumnDef<SetupTrade & { indicator?: { name: string } | null }>[] = [
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
    accessorKey: "indicator.name",
    header: () => <div className="text-left px-3 py-2">Indikator</div>,
    cell: ({ row }) => {
      const indicator = row.original.indicator?.name;
      return (
        <div className="px-3 py-2 text-muted-foreground">
          {indicator || <span className="italic">-</span>}
        </div>
      );
    },
  },
  {
    accessorKey: "timeframe",
    header: () => <div className="text-left px-3 py-2">Timeframe</div>,
    cell: ({ row }) => <div className="px-3 py-2">{row.getValue("timeframe")}</div>,
  },
  {
    accessorKey: "winrate",
    header: () => <div className="text-left px-3 py-2">Winrate</div>,
    cell: () => <div className="px-3 py-2"></div>,
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
