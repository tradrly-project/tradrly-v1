"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "@heroicons/react/24/solid";

import { SetupTrade } from "@prisma/client"; // atau tipe custom kamu
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<
  SetupTrade & {
    indicators: { name: string; code: string }[] | null;
    timeframes: { code: string }[] | null;
  }
>[] = [
  {
    accessorKey: "name",
    header: () => <div className="text-left px-3 py-2">Nama Setup</div>,
    cell: ({ row }) => <div className="px-3 py-2">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "strategy",
    header: () => <div className="text-left px-3 py-2">Strategi</div>,
    cell: ({ row }) => (
      <div className="px-3 py-2">{row.getValue("strategy")}</div>
    ),
  },
  {
    accessorKey: "indicators",
    header: () => <div className="text-left px-3 py-2">Indikator</div>,
    cell: ({ row }) => {
      const indicators = row.original.indicators as { code: string }[];
      const MAX_BADGES = 3;

      if (!indicators?.length) {
        return <div className="px-3 py-2 text-muted-foreground">-</div>;
      }

      const hiddenIndicators = indicators.slice(MAX_BADGES);

      return (
        <div className="flex items-center flex-wrap gap-1 px-3 py-2 max-w-[95%]">
          {indicators.slice(0, MAX_BADGES).map((indicator) => (
            <Badge
              key={indicator.code}
              variant="default"
              className="text-xs px-2 py-1 m-0 whitespace-nowrap"
            >
              {indicator.code}
            </Badge>
          ))}

          {hiddenIndicators.length > 0 && (
            <Badge
              variant="default"
              className="text-xs px-2 py-1 m-0 whitespace-nowrap ml-1"
            >
              ...
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "timeframes",
    header: () => <div className="text-left px-3 py-2">Timeframe</div>,
    cell: ({ row }) => {
      const timeframes = row.original.timeframes as { code: string }[];
      const MAX_BADGES = 3;

      if (!timeframes?.length) {
        return <div className="px-3 py-2 text-muted-foreground">-</div>;
      }

      const hiddenTimeframes = timeframes.slice(MAX_BADGES);

      return (
        <div className="flex items-center flex-wrap gap-1 px-3 py-2 max-w-[95%]">
          {timeframes.slice(0, MAX_BADGES).map((tf) => (
            <Badge
              key={tf.code}
              variant="default"
              className="text-xs px-2 py-1 m-0 whitespace-nowrap"
            >
              {tf.code}
            </Badge>
          ))}

          {hiddenTimeframes.length > 0 && (
            <Badge
              variant="default"
              className="text-xs px-2 py-1 m-0 whitespace-nowrap ml-1"
            >
              ...
            </Badge>
          )}
        </div>
      );
    },
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
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 p-0 cursor-pointer"
        >
          <EyeIcon className="h-4 w-4" />
        </Button>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
