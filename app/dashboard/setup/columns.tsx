"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { SetupTradeDetailDialog } from "@/components/setup/detail";
import { SetupTrade } from "@prisma/client";

export const createSetupColumns = ({
  indicator,
  timeframe,
}: {
  indicator: { id: string; name: string; code: string }[];
  timeframe: { id: string; code: string }[];
}): ColumnDef<
  SetupTrade & {
    indicators: { name: string; code: string }[] | null;
    timeframes: { code: string }[] | null;
  }
>[] => [
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
    cell: ({ row }) => {
      const value = row.getValue("winrate") as number | null;
      const winrate = typeof value === "number" ? value : null;
      const extraClass =
        winrate === null || winrate === 0
          ? ""
          : winrate <= 50
          ? "bg-red-500 text-white"
          : "bg-sky-500 text-white";

      return (
        <div className="flex items-center px-3 py-2">
          {winrate !== null ? (
            <Badge
              variant="default"
              className={`text-xs px-2 py-1 whitespace-nowrap ${extraClass}`}
            >
              {winrate.toFixed(1)}%
            </Badge>
          ) : (
            <span className="text-xs text-muted-foreground">-</span>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center px-2 py-2"/>,
    cell: ({ row }) => {
      const setup = row.original;

      const mappedIndicators = setup.indicators
        ? indicator.filter((i) =>
            setup.indicators!.some(
              (r) => r.name === i.name && r.code === i.code
            )
          )
        : undefined;

      const mappedTimeframes = setup.timeframes
        ? timeframe.filter((t) =>
            setup.timeframes!.some((r) => r.code === t.code)
          )
        : undefined;

      return (
        <div className="flex justify-center px-2 py-2">
          <SetupTradeDetailDialog
            setup={{
              ...setup,
              indicators: mappedIndicators,
              timeframes: mappedTimeframes,
            }}
            indicator={indicator}
            timeframe={timeframe}
          />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
