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
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState } from "react";
import { TradeWithPair } from "@/lib/types";
import Image from "next/image";

interface Props {
  trade: TradeWithPair;
}

const resultColor = {
  WIN: "bg-sky-500 text-white",
  LOSE: "bg-red-500 text-white",
  BE: "bg-zinc-900 text-black",
};

const directionColor = {
  BUY: "bg-green-600 text-white",
  SELL: "bg-red-600 text-white",
};

export function TradeDetailDialog({ trade }: Props) {
  const [openTooltip, setOpenTooltip] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);

  const handleClick = () => {
    setOpenTooltip(false);
    setOpenDialog(true);
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

      {/* MAIN DIALOG */}
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
            {/* Sticky Header */}
            <div className="sticky top-0 z-50 bg-background px-6 pt-6">
              <div className="flex justify-between items-center">
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

            {/* Content */}
            <div className="mt-6 space-y-5 text-sm text-muted-foreground px-4 pb-6">
              <TradeInfoGrid trade={trade} />
              <TradeNotes notes={trade.notes} />
              {trade.screenshotUrl && (
                <TradeScreenshot
                  url={trade.screenshotUrl}
                  onClick={() => setIsImageOpen(true)}
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* IMAGE ZOOM DIALOG */}
      <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
        <DialogContent
          className="w-1/2 p-0 bg-transparent border-none"
          showCloseButton={false}
        >
          <VisuallyHidden>
            <DialogTitle>Screenshot Zoom</DialogTitle>
          </VisuallyHidden>

          <div className="relative">
            <DialogPrimitive.Close asChild>
              <button className="absolute top-2 right-2 z-10 bg-black/60 hover:bg-black/80 text-white p-1 rounded-md cursor-pointer">
                <XIcon className="w-5 h-5" />
              </button>
            </DialogPrimitive.Close>

            <Image
              src={trade.screenshotUrl!}
              alt="Zoomed Screenshot"
              width={2000}
              height={2000}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ===== Subcomponents =====

function TradeInfoGrid({ trade }: { trade: TradeWithPair }) {
  return (
    <div className="grid grid-cols-3 gap-y-2">
      <TradeRow label="Pair" value={trade.pair.symbol} />
      <TradeRow
        label="Direction"
        value={
          <Badge
            className={`text-xs px-2 py-1 rounded-md capitalize ${directionColor[trade.direction.toUpperCase() as keyof typeof directionColor]
              }`}
          >
            {trade.direction.toLowerCase()}
          </Badge>
        }
      />
      <TradeRow
        label="Result"
        value={
          <Badge
            className={`text-xs px-2 py-1 rounded-md ${resultColor[trade.result.toUpperCase() as keyof typeof resultColor]
              }`}
          >
            {trade.result.toUpperCase()}
          </Badge>
        }
      />
      <TradeRow label="Risk Ratio" value={trade.riskRatio.toString()} />
      <TradeRow label="Profit/Loss" value={`$ ${Number(trade.profitLoss).toFixed(2)}`} />
      <TradeRow label="Entry" value={`$ ${Number(trade.entryPrice).toFixed(2)}`} />
      <TradeRow label="Stoploss" value={`$ ${Number(trade.stoploss).toFixed(2)}`} />
      <TradeRow label="Take Profit" value={`$ ${Number(trade.takeProfit).toFixed(2)}`} />
      <TradeRow label="Exit Price" value={`$ ${Number(trade.exitPrice).toFixed(2)}`} />
      <TradeRow label="Lot Size" value={trade.lotSize.toString()} />
      <TradeRow
        label="Setup"
        value={<span className="italic">{trade.setupTrade?.name ?? "-"}</span>}
      />
      <TradeRow
        label="Tanggal"
        value={new Date(trade.date).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      />
    </div>
  );
}

function TradeRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <>
      <span className="font-medium text-foreground">{label}</span>
      <span className="col-span-2 text-foreground mb-2">{value}</span>
    </>
  );
}

function TradeNotes({ notes }: { notes?: string | null }) {
  return (
    <div className="bg-zinc-950 rounded-md h-full py-2 px-4">
      <div className="font-medium text-foreground mb-3">Catatan</div>
      {notes?.trim() ? (
        <div className="rounded-md p-3 text-sm text-foreground">{notes}</div>
      ) : (
        <span className="italic text-muted-foreground">Tidak ada catatan</span>
      )}
    </div>
  );
}

function TradeScreenshot({ url, onClick }: { url: string; onClick: () => void }) {
  return (
    <div>
      <div className="font-medium text-foreground mb-2">Screenshot</div>
      <Image
        width={640}
        height={640}
        src={url}
        alt="Trade Screenshot"
        className="rounded-md w-full object-cover border cursor-zoom-in"
        onClick={onClick}
      />
    </div>
  );
}
