import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { TradeWithPair } from "@/lib/types";
import { Decimal } from "@prisma/client/runtime/library";

type TradeWithAll = TradeWithPair & {
  psychologies: Psychology[];
};
type Props = {
  trade: TradeWithAll;
};

type Psychology = {
  id: string;
  name: string;
};

export function TradeDetailDialog({ trade } : Props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [openTooltip, setOpenTooltip] = useState(false);

  const handleClick = () => {
    setOpenDialog(true);
    setOpenTooltip(false);
  };

  const formatDecimal = (
    value: Decimal | number | string | null | undefined,
    digits = 2
  ): string => {
    if (value === null || value === undefined) return "-";

    let numberValue: number;

    if (typeof value === "number") {
      numberValue = value;
    } else if (typeof value === "string") {
      numberValue = parseFloat(value);
    } else {
      // Prisma Decimal
      numberValue = parseFloat(value.toString());
    }

    return isNaN(numberValue) ? "-" : numberValue.toFixed(digits);
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
          className="w-[480px] p-0 rounded-2xl overflow-y-auto bg-background"
          style={{ maxHeight: "90vh" }}
          showCloseButton={false}
        >
          <div className="flex flex-col min-h-full">
            <div className="sticky top-0 z-50 bg-background">
              <div className="flex justify-between items-center py-4 px-4">
                <DialogTitle className="text-2xl font-bold">Detail Trade</DialogTitle>
                <DialogPrimitive.Close asChild>
                  <button className="cursor-pointer text-white">
                    <XIcon className="w-5 h-5" />
                  </button>
                </DialogPrimitive.Close>
              </div>
            </div>

            <div className="space-y-5 text-sm text-muted-foreground px-4 mt-4">
              <div className="grid grid-cols-3 gap-y-2 gap-x-2">
                <span className="font-medium text-foreground">Tanggal</span>
                <span className="col-span-2 text-foreground">
                  {new Date(trade.date).toLocaleString()}
                </span>

                <span className="font-medium text-foreground">Pair</span>
                <span className="col-span-2 text-foreground">{trade.pair.symbol}</span>

                <span className="font-medium text-foreground">Setup</span>
                <span className="col-span-2 text-foreground">{trade.setupTrade?.name}</span>

                <span className="font-medium text-foreground">Psikologi</span>
                <span className="col-span-2 text-foreground italic">
                  {trade.psychologies.length > 0 ? (
                    trade.psychologies.map((p) => (
                      <Badge
                        key={p.id}
                        variant="secondary"
                        className="text-xs rounded-md bg-zinc-900 text-foreground mr-1"
                      >
                        {p.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="italic text-muted-foreground">Tidak ada</span>
                  )}
                </span>

                <span className="font-medium text-foreground">Result</span>
                <span className="col-span-2">
                  <Badge
                    className={`text-xs rounded-md ${trade.result === "win"
                        ? "bg-green-500"
                        : trade.result === "loss"
                          ? "bg-red-500"
                          : "bg-zinc-700"
                      }`}
                  >
                    {trade.result}
                  </Badge>
                </span>

                <span className="font-medium text-foreground">Profit / Loss</span>
                <span className="col-span-2 text-foreground">{formatDecimal(trade.profitLoss)}</span>

                <span className="font-medium text-foreground">Risk Ratio</span>
                <span className="col-span-2 text-foreground">{formatDecimal(trade.riskRatio)}</span>

                <span className="font-medium text-foreground">Arah</span>
                <span className="col-span-2 text-foreground capitalize">{trade.direction}</span>

                <span className="font-medium text-foreground">Entry Price</span>
                <span className="col-span-2 text-foreground">{formatDecimal(trade.entryPrice)}</span>

                <span className="font-medium text-foreground">Take Profit</span>
                <span className="col-span-2 text-foreground">{formatDecimal(trade.takeProfit)}</span>

                <span className="font-medium text-foreground">Stoploss</span>
                <span className="col-span-2 text-foreground">{formatDecimal(trade.stoploss)}</span>

                <span className="font-medium text-foreground">Exit Price</span>
                <span className="col-span-2 text-foreground">{formatDecimal(trade.exitPrice)}</span>

                <span className="font-medium text-foreground">Lot Size</span>
                <span className="col-span-2 text-foreground">{formatDecimal(trade.lotSize)}</span>
              </div>

              <div className="bg-zinc-950 rounded-md h-full py-2 px-4">
                <div className="font-medium text-foreground mb-3">Catatan</div>
                {trade.notes?.trim() ? (
                  <div className="rounded-md p-3 text-sm text-foreground">
                    {trade.notes}
                  </div>
                ) : (
                  <span className="italic text-muted-foreground">Tidak ada catatan</span>
                )}
              </div>

              {trade.screenshotUrl && (
                <div className="mt-4">
                  <div className="font-medium text-foreground mb-2">Screenshot</div>
                  <Image
                    src={trade.screenshotUrl}
                    alt="Screenshot"
                    width={400}
                    height={200}
                    className="rounded-md border border-zinc-800"
                  />
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
