import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { TradeWithPair } from "@/lib/types";
import { Decimal } from "@prisma/client/runtime/library";
import { DeleteButton, SaveChangesButton, TradePayload } from "../button";
import React from "react";
import { PsychologySelect } from "../select/psychology-select";
import { DatePickerWithPresets } from "../asset/date-picker";
import { DropdownMenuSelect } from "../select/direction";
import { TradeDirection } from "@prisma/client";
import { ComboBox } from "../asset/combo-box";
import { calculateDerivedFields as calculateTradeFields } from "@/lib/tradeCalculations";


type Pair = { id: string; symbol: string };
type SetupTrade = { id: string; name: string };
type Psychology = { id: string; name: string };
type Option = { label: string; value: string };
type Props = {
  trade: TradeWithPair & { psychologies: Psychology[] };
  pairs: Pair[];
  setupTrades: SetupTrade[];
  allPsychologies: Psychology[];
};

export function TradeDetailDialog({
  trade,
  pairs,
  setupTrades,
  allPsychologies,
}: Props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [openTooltip, setOpenTooltip] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPending] = useTransition();

  const [formData, setFormData] = useState({
    date: new Date(trade.date).toISOString().slice(0, 10),
    pairId: trade.pair?.id || "",
    setupTradeId: trade.setupTrade?.id || "",
    psychologyIds: trade.psychologies.map((p) => p.id),
    direction: trade.direction,
    entryPrice: trade.entryPrice.toString(),
    takeProfit: trade.takeProfit.toString(),
    stoploss: trade.stoploss.toString(),
    exitPrice: trade.exitPrice.toString(),
    lotSize: trade.lotSize.toString(),
  });

  const availablePsychologies = allPsychologies.map((p) => ({
    label: p.name,
    value: p.id,
  }));

  const [selectedPsychologies, setSelectedPsychologies] = useState<Option[]>(
    trade.psychologies.map((p) => ({
      label: p.name,
      value: p.id,
    }))
  );
  

  const handleChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
    };

  const formatDecimal = (
    value: Decimal | number | string | null | undefined,
    digits = 2
  ): string => {
    if (value === null || value === undefined) return "-";
    const numberValue =
      typeof value === "number" ? value : parseFloat(value.toString());
    return isNaN(numberValue) ? "-" : numberValue.toFixed(digits);
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d
      .toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
      .replace(/\s/g, " - ");
  };

  const formatDollar = (
    value: Decimal | number | string | null | undefined,
    digits = 2
  ) => {
    if (value == null) return "-";
    const num = parseFloat(value.toString());
    return isNaN(num) ? "-" : `$ ${num.toFixed(digits)}`;
  };

  const formatLot = (value: Decimal | number | string | null | undefined) => {
    if (value == null) return "-";
    const num = parseFloat(value.toString());
    return isNaN(num) ? "-" : `${num} Lot`;
  };

  const calculateDerivedFields = () => {
    const entry = parseFloat(formData.entryPrice);
    const exit = parseFloat(formData.exitPrice);
    const tp = parseFloat(formData.takeProfit);
    const sl = parseFloat(formData.stoploss);
    const lot = parseFloat(formData.lotSize);
    const direction = formData.direction;

    return calculateTradeFields({
      entryPrice: entry,
      exitPrice: exit,
      takeProfit: tp,
      stoploss: sl,
      lotSize: lot,
      direction,
    });
  };
  

  return (
    <>
      <Tooltip open={openTooltip} onOpenChange={setOpenTooltip}>
        <TooltipTrigger asChild>
          <Button
            onClick={() => {
              setOpenDialog(true);
              setOpenTooltip(false);
            }}
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

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent
          className="w-[480px] p-0 rounded-2xl overflow-y-auto bg-background"
          style={{ maxHeight: "90vh" }}
          showCloseButton={false}
        >
          <div className="flex flex-col min-h-full">
            <div className="sticky top-0 z-50 bg-background">
              <div className="flex justify-between items-center py-4 px-4">
                <DialogTitle className="text-2xl font-bold">
                  Detail Trade
                </DialogTitle>
                <DialogPrimitive.Close asChild>
                  <button className="cursor-pointer text-white">
                    <XIcon className="w-5 h-5" />
                  </button>
                </DialogPrimitive.Close>
              </div>
              <div className="flex justify-end px-4 pb-2">
                {isEditing ? (
                  <>
                    <SaveChangesButton<TradePayload>
                      type="trade"
                      id={trade.id}
                      payload={{
                        pairId: formData.pairId,
                        psychologyIds: selectedPsychologies.map((p) => p.value),
                        date: formData.date,
                        setupTradeId: formData.setupTradeId,
                        direction: formData.direction,
                        entryPrice: parseFloat(formData.entryPrice),
                        takeProfit: parseFloat(formData.takeProfit),
                        stoploss: parseFloat(formData.stoploss),
                        exitPrice: parseFloat(formData.exitPrice),
                        lotSize: parseFloat(formData.lotSize),
                        ...calculateDerivedFields(),
                      }}
                      disabled={isPending}
                      onSuccess={() => setIsEditing(false)}
                    />
                    <Button variant="ghost" onClick={() => setIsEditing(false)}>
                      Batal
                    </Button>
                    <DeleteButton
                      id={trade.id}
                      type="trade"
                      onSuccess={() => setOpenDialog(false)}
                    />

                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>Edit</Button>
                )}
              </div>
            </div>

            <div className="space-y-5 text-sm text-muted-foreground px-4 mt-2">
              <div className="grid grid-cols-3 gap-y-2 gap-x-2">
                <Field label="Tanggal">
                  {isEditing ? (
                    <>
                      <DatePickerWithPresets
                        name="date"
                        value={
                          formData.date ? new Date(formData.date) : new Date()
                        }
                        onChange={(date) =>
                          setFormData((prev) => ({
                            ...prev,
                            date: date.toISOString(), // ✅ ubah ke string
                          }))
                        }
                      />
                      <input
                        type="hidden"
                        name="date"
                        value={
                          formData.date
                            ? new Date(formData.date).toISOString()
                            : ""
                        }
                      />
                    </>
                  ) : (
                    formatDate(formData.date)
                  )}
                </Field>

                <Field label="Pair">
                  {isEditing ? (
                    <ComboBox
                      name="pairId"
                      value={formData.pairId}
                      onChange={(value) =>
                        setFormData((prev) => ({ ...prev, pairId: value }))
                      }
                      placeholder="Pilih Pair"
                      options={pairs.map((pair) => ({
                        value: pair.id,
                        label: pair.symbol,
                      }))}
                    />
                  ) : (
                    pairs.find((p) => p.id === formData.pairId)?.symbol || "-"
                  )}
                </Field>

                <Field label="Setup">
                  {isEditing ? (
                    <ComboBox
                      name="setupTradeId"
                      value={formData.setupTradeId}
                      onChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          setupTradeId: value,
                        }))
                      }
                      placeholder="Pilih Setup Trade"
                      options={setupTrades.map((s) => ({
                        value: s.id,
                        label: s.name,
                      }))}
                    />
                  ) : (
                    setupTrades.find(
                      (s) =>
                        s.id.toString() === formData.setupTradeId.toString()
                    )?.name ?? "-"
                  )}
                </Field>

                <Field label="Psikologi">
                  {isEditing ? (
                    <PsychologySelect
                      name="psychology"
                      options={availablePsychologies}
                      selected={selectedPsychologies}
                      onChange={(selected) => {
                        setSelectedPsychologies(selected);
                        setFormData((prev) => ({
                          ...prev,
                          psychologyIds: selected.map((s) => s.value),
                        }));
                      }}
                    />
                  ) : trade.psychologies && trade.psychologies.length > 0 ? (
                    trade.psychologies.map((p) => (
                      <Badge
                        key={p.id}
                        variant="secondary"
                        className="text-xs bg-zinc-900 mr-1 text-foreground"
                      >
                        {p.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="italic">Tidak ada</span>
                  )}
                </Field>

                <Field label="Arah">
                  {isEditing ? (
                    <DropdownMenuSelect
                      name="direction"
                      value={formData.direction}
                      onChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          direction: value as TradeDirection,
                        }))
                      }
                      options={[
                        { label: "Buy", value: "buy" },
                        { label: "Sell", value: "sell" },
                      ]}
                    />
                  ) : (
                    formData.direction
                  )}
                </Field>

                {(
                  [
                    "entryPrice",
                    "takeProfit",
                    "stoploss",
                    "exitPrice",
                    "lotSize",
                  ] as const
                ).map((field) => (
                  <Field key={field} label={field.replace(/([A-Z])/g, " $1")}>
                    {isEditing ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={formData[field]}
                        onChange={handleChange(field)}
                      />
                    ) : field === "lotSize" ? (
                      formatLot(formData[field])
                    ) : (
                      formatDollar(formData[field])
                    )}
                  </Field>
                ))}

                {/* Otomatis hasil */}
                <Field label="Result">
                  <Badge
                    className={`text-xs rounded-md ${
                      calculateDerivedFields().result === "win"
                        ? "bg-sky-500"
                        : calculateDerivedFields().result === "loss"
                        ? "bg-red-500"
                        : "bg-zinc-700"
                    }`}
                  >
                    {calculateDerivedFields().result.toUpperCase()}
                  </Badge>
                </Field>

                <Field label="Profit / Loss">
                  {formatDollar(calculateDerivedFields().profitLoss)}
                </Field>
                <Field label="Risk Ratio">
                  {formatDecimal(calculateDerivedFields().riskRatio)}
                </Field>
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
                <div className="mt-4">
                  <div className="font-medium text-foreground mb-2">
                    Screenshot
                  </div>
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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <span className="font-medium text-foreground">{label}</span>
      <span className="col-span-2 text-foreground">{children}</span>
    </>
  );
}
