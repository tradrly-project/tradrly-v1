"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EllipsisHorizontalIcon from "@heroicons/react/24/solid/EllipsisHorizontalIcon";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type Props = {
    setup: {
        id: string;
        name: string;
        strategy: string;
        notes?: string | null;
        winrate?: number | null;
        indicators?: { name: string }[];
        timeframes?: { code: string }[];
    };
};

export function SetupTradeDetailDialog({ setup }: Props) {
    return (
        <Dialog>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-sm p-0 cursor-pointer bg-zinc-900"
                        >
                            <EllipsisHorizontalIcon className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent side="right" align="center">
                    Detail
                </TooltipContent>
            </Tooltip>
            <DialogContent className="w-[400px] py-6">
                <DialogHeader>
                    <DialogTitle className="text-2xl mb-10">Detail Setup</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 text-sm text-muted-foreground">
                    <div>
                        <span className="font-medium text-foreground">Nama Setup:</span> {setup.name}
                    </div>
                    <div>
                        <span className="font-medium text-foreground">Strategi:</span> {setup.strategy}
                    </div>
                    <div>
                        <span className="font-medium text-foreground">Winrate:</span>{" "}
                        {setup.winrate !== null && setup.winrate !== undefined ? (
                            <Badge
                                variant="default"
                                className={`text-xs px-2 py-1 ${setup.winrate === 0
                                    ? ""
                                    : setup.winrate <= 50
                                        ? "bg-red-500 text-white"
                                        : "bg-sky-500 text-white"
                                    }`}
                            >
                                {setup.winrate.toFixed(1)}%
                            </Badge>
                        ) : (
                            "-"
                        )}
                    </div>

                    {setup.indicators && setup.indicators.length > 0 && (
                        <div>
                            <span className="font-medium text-foreground">Indikator:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {setup.indicators.map((ind) => (
                                    <Badge key={ind.name} variant="secondary" className="text-xs">
                                        {ind.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {setup.timeframes && setup.timeframes.length > 0 && (
                        <div>
                            <span className="font-medium text-foreground">Timeframe:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {setup.timeframes.map((tf) => (
                                    <Badge key={tf.code} variant="secondary" className="text-xs">
                                        {tf.code}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                    <div>
                        <span className="font-medium text-foreground">Catatan:</span>{" "}
                        {typeof setup.notes === "string" && setup.notes.trim().length > 0
                            ? setup.notes
                            : <span className="italic text-muted-foreground">Tidak ada catatan</span>}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
