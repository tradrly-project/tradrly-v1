"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import EllipsisHorizontalIcon from "@heroicons/react/24/solid/EllipsisHorizontalIcon";
import { Badge } from "@/components/ui/badge";

import { useState } from "react";
import { TradeWithPair } from "@/lib/types";
import Image from "next/image";

interface Props {
  trade: TradeWithPair;
}

export function TradeDetailDialog({ trade }: Props) {
  const [openTooltip, setOpenTooltip] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleClick = () => {
    setOpenTooltip(false);
    setOpenDialog(true);
  };

  const resultColor = {
    WIN: "bg-sky-500 text-white",
    LOSE: "bg-red-500 text-white",
    BE: "bg-zinc-900 text-black",
  };

  const directionColor = {
    BUY: "bg-green-600 text-white",
    SELL: "bg-red-600 text-white",
  };

  return (
    <>
      <Tooltip open={openTooltip} onOpenChange={setOpenTooltip}>
        <TooltipTrigger asChild>
          <Button
            onClick={handleClick}
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-sm p-0 cursor-pointer bg-zinc-900"
          >
            <EllipsisHorizontalIcon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" align="center">
          Detail
        </TooltipContent>
      </Tooltip>

      <Dialog
        open={openDialog}
        onOpenChange={(isOpen) => {
          setOpenDialog(isOpen);
          if (!isOpen) setOpenTooltip(false);
        }}
      >
        <DialogContent
          className="w-[480px] pt-6 rounded-2xl"
          showCloseButton={false}
        >
          <div className="sticky top-0 z-50 bg-background">
            <div className="flex justify-between items-center pb-2">
              <DialogTitle className="text-2xl font-bold">
                Detail Trade
              </DialogTitle>
              <DialogPrimitive.Close asChild>
                <button className="cursor-pointer text-white">
                  <XIcon className="w-5 h-5" />
                </button>
              </DialogPrimitive.Close>
            </div>
          </div>

          <div className="mt-6 space-y-5 text-sm text-muted-foreground px-2">
            <div className="grid grid-cols-3 gap-y-2">
              <span className="font-medium text-foreground">Pair</span>
              <span className="col-span-2 text-foreground mb-2">
                {trade.pair.symbol}
              </span>

              <span className="font-medium text-foreground">Direction</span>
              <span className="col-span-2">
                <Badge
                  variant="default"
                  className={`text-xs px-2 py-1 rounded-md capitalize ${
                    directionColor[
                      trade.direction as keyof typeof directionColor
                    ]
                  }`}
                >
                  {trade.direction.toLowerCase()}
                </Badge>
              </span>

              <span className="font-medium text-foreground">Result</span>
              <span className="col-span-2">
                <Badge
                  variant="default"
                  className={`text-xs px-2 py-1 rounded-md ${
                    resultColor[
                      trade.result.toUpperCase() as keyof typeof resultColor
                    ]
                  }`}
                >
                  {trade.result.toUpperCase()}
                </Badge>
              </span>

              <span className="font-medium text-foreground">Risk Ratio</span>
              <span className="col-span-2 text-foreground mb-2">
                {trade.riskRatio.toString()}
              </span>

              <span className="font-medium text-foreground">Profit/Loss</span>
              <span className="col-span-2 text-foreground mb-2">
                $ {Number(trade.profitLoss).toFixed(2)}
              </span>

              <span className="font-medium text-foreground">Entry</span>
              <span className="col-span-2 text-foreground mb-2">
                $ {Number(trade.entryPrice).toFixed(2)}
              </span>

              <span className="font-medium text-foreground">Stoploss</span>
              <span className="col-span-2 text-foreground mb-2">
                $ {Number(trade.stoploss).toFixed(2)}
              </span>

              <span className="font-medium text-foreground">Take Profit</span>
              <span className="col-span-2 text-foreground mb-2">
                $ {Number(trade.takeProfit).toFixed(2)}
              </span>

              <span className="font-medium text-foreground">Exit Price</span>
              <span className="col-span-2 text-foreground mb-2">
                $ {Number(trade.exitPrice).toFixed(2)}
              </span>

              <span className="font-medium text-foreground">Lot Size</span>
              <span className="col-span-2 text-foreground mb-2">
                {trade.lotSize.toString()}
              </span>

              <span className="font-medium text-foreground">Setup</span>
              <span className="col-span-2 text-foreground mb-2 italic">
                {trade.setupTrade?.name ?? "-"}
              </span>

              <span className="font-medium text-foreground">Tanggal</span>
              <span className="col-span-2 text-foreground mb-2">
                {new Date(trade.date).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="bg-zinc-950 rounded-md h-full py-2 px-4">
              <div className="font-medium text-foreground mb-3">Catatan</div>
              {trade.notes?.trim() ? (
                <div className="rounded-md p-3 text-sm text-foreground">
                  {trade.notes}
                </div>
              ) : (
                <span className="italic text-muted-foreground">
                  Tidak ada catatan
                </span>
              )}
            </div>

            {trade.screenshotUrl && (
              <div>
                <div className="font-medium text-foreground mb-2">
                  Screenshot
                </div>
                <Image
                  width={640}
                  height={640}
                  src={trade.screenshotUrl}
                  alt="Trade Screenshot"
                  className="rounded-md w-full object-cover border"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
