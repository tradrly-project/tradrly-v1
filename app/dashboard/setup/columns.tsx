"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { SetupTrade } from "@prisma/client"; // atau tipe custom kamu
import { Badge } from "@/components/ui/badge";
import { SetupTradeDetailDialog } from "@/components/asset/setup-trade-detail-dialog";

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
      cell: ({ row }) => {
        const value = row.getValue("winrate") as number | null;
        const winrate = typeof value === "number" ? value : null;

        // Tambah warna hanya kalau > 0 %
        const extraClass =
          winrate === null || winrate === 0
            ? ""                                   // biarkan variant default
            : winrate <= 50
              ? "bg-red-500 text-white"            // 1-50 %
              : "bg-sky-500 text-white";           // 51-100 %

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
      header: () => <div className="text-center px-2 py-2">Aksi</div>,
      cell: ({ row }) => {
        const setup = row.original; // pastikan data SetupTrade sudah dimuat dengan benar

        return (
          <div className="flex justify-center px-2 py-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <SetupTradeDetailDialog
                  setup={{
                    ...setup,
                    indicators: setup.indicators ?? undefined,
                    timeframes: setup.timeframes ?? undefined,
                  }}
                />
              </TooltipTrigger>
              <TooltipContent side="right" align="center">
                Detail
              </TooltipContent>
            </Tooltip>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];
