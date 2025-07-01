"use client";
import { useEffect, useState, useTransition } from "react";
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
import { ScreenshotType, TradeDirection, UserPsychology } from "@prisma/client";
import { ComboBox } from "../asset/combo-box";
import { calculateDerivedFields as calculateTradeFields } from "@/lib/tradeCalculations";
import LabelInputContainer from "../asset/label-input";
import { FileUpload, FileWithMeta } from "../ui/file-upload";

type Pair = { id: string; symbol: string };
type SetupTrade = { id: string; name: string };
type Psychology = { id: string; name: string };
type Option = { label: string; value: string };
type TradeScreenshot = {
  id: string;
  tradeId: string;
  type: "BEFORE" | "AFTER";
  url: string;
  createdAt: Date;
};
type Screenshot = { type: "BEFORE" | "AFTER"; url: string; file?: File };
type Props = {
  journal: TradeWithPair & {
    psychologies: (UserPsychology & { psychology: Psychology })[];
    screenshots: TradeScreenshot[];
  };
  pairs: Pair[];
  setupTrades: SetupTrade[];
  allPsychologies: Psychology[];
};

export function TradeDetailDialog({
  journal,
  pairs,
  setupTrades,
  allPsychologies,
}: Props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [openTooltip, setOpenTooltip] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPending] = useTransition();

  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [beforeFiles, setBeforeFiles] = useState<FileWithMeta[]>([]);
  const [afterFiles, setAfterFiles] = useState<FileWithMeta[]>([]);
  const [showUploadBefore, setShowUploadBefore] = useState(false);
  const [showUploadAfter, setShowUploadAfter] = useState(false);
  const [notes, setNotes] = useState(journal.notes || "");

  const [formData, setFormData] = useState({
    date: new Date(journal.date).toISOString().slice(0, 10),
    pairId: journal.pair?.id || "",
    setupTradeId: journal.setupTrade?.id || "",
    psychologyIds: journal.psychologies.map((p) => p.id),
    direction: journal.direction,
    entryPrice: journal.entryPrice.toString(),
    takeProfit: journal.takeProfit.toString(),
    stoploss: journal.stoploss.toString(),
    exitPrice: journal.exitPrice.toString(),
    lotSize: journal.lotSize.toString(),
  });

  const availablePsychologies = allPsychologies.map((p) => ({
    label: p.name,
    value: p.id,
  }));

  const [selectedPsychologies, setSelectedPsychologies] = useState<Option[]>(
    journal.psychologies.map((p) => ({
      label: p.psychology.name,
      value: p.psychology.id,
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

  const fieldLabels: Record<
    "entryPrice" | "takeProfit" | "stoploss" | "exitPrice" | "lotSize",
    string
  > = {
    entryPrice: "Entry",
    takeProfit: "Take Profit",
    stoploss: "Stoploss",
    exitPrice: "Exit",
    lotSize: "Lot Size",
  };

  const handleScreenshotUpload = (file: File, type: ScreenshotType) => {
    const previewUrl = URL.createObjectURL(file);
    const updated = screenshots.filter((s) => s.type !== type);
    setScreenshots([...updated, { type, url: previewUrl, file }]);
  };

  useEffect(() => {
    if (isEditing) {
      setScreenshots(journal.screenshots); // ambil gambar dari server/backend
      setShowUploadBefore(false);
      setShowUploadAfter(false);
    }
  }, [isEditing, journal.screenshots]);

  const preparePayloadBeforeSave = async (): Promise<TradePayload> => {
    const uploadedScreenshots = await Promise.all(
      screenshots.map(async (s) => {
        if (s.file) {
          const formData = new FormData();
          formData.append("file", s.file);
          const res = await fetch("/api/file/upload", {
            method: "PUT",
            body: formData,
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Upload failed");
          return { type: s.type, url: data.url };
        }
        return { type: s.type, url: s.url };
      })
    );

    // Hapus file dari Vercel Blob jika URL-nya ditandai
    await Promise.all(
      deletedUrls.map(async (url) => {
        try {
          await fetch("/api/file/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url }),
          });
        } catch (err) {
          console.error("Failed to delete file from blob:", err);
        }
      })
    );

    return {
      psychologyIds: selectedPsychologies.map((p) => p.value),
      date: formData.date,
      setupTradeId: formData.setupTradeId,
      direction: formData.direction,
      entryPrice: parseFloat(formData.entryPrice),
      takeProfit: parseFloat(formData.takeProfit),
      stoploss: parseFloat(formData.stoploss),
      exitPrice: parseFloat(formData.exitPrice),
      lotSize: parseFloat(formData.lotSize),
      notes,
      screenshots: uploadedScreenshots,
      ...calculateDerivedFields(),
    };
  };

  const [deletedUrls, setDeletedUrls] = useState<string[]>([]);

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
          className="min-w-3xl p-0 rounded-2xl bg-background flex flex-col"
          style={{ maxHeight: "90vh" }}
          showCloseButton={false}
        >
          {/* Header */}
          <div className="shrink-0 sticky top-0 z-50 bg-background px-4 pt-6 pb-4">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-2xl font-bold">
                {isEditing ? "Edit Jurnal" : "Detail Jurnal"}
              </DialogTitle>
              <DialogPrimitive.Close asChild>
                <button
                  className="cursor-pointer bg-zinc-800 rounded-md p-0.5 hover:text-zinc-500"
                  onClick={() => setIsEditing(false)}
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </DialogPrimitive.Close>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-hidden px-4">
            <div className="grid grid-cols-3 gap-6 h-full overflow-hidden">
              {/* Kiri: Field-form */}
              <div className="col-span-2 overflow-y-auto bg-red- px-1 rounded-md space-y-4">
                {/* Pair */}
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    {pairs.find((p) => p.id === formData.pairId)?.symbol || "-"}
                  </h3>

                  {isEditing && (
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Result */}
                      <Badge
                        className={`text-xs rounded-sm ${
                          calculateDerivedFields().result === "win"
                            ? "bg-sky-500 text-white"
                            : calculateDerivedFields().result === "loss"
                            ? "bg-red-500 text-white"
                            : "bg-zinc-700 text-white"
                        }`}
                      >
                        {calculateDerivedFields().result.toUpperCase()}
                      </Badge>

                      {/* PnL */}
                      <Badge
                        className={`text-xs rounded-sm ${
                          calculateDerivedFields().profitLoss > 0
                            ? "bg-sky-500 text-white"
                            : calculateDerivedFields().profitLoss < 0
                            ? "bg-red-500 text-white"
                            : "bg-zinc-700 text-white"
                        }`}
                      >
                        PnL {formatDollar(calculateDerivedFields().profitLoss)}
                      </Badge>

                      {/* RR */}
                      <Badge className="text-xs rounded-sm ">
                        RR {formatDecimal(calculateDerivedFields().riskRatio)}
                      </Badge>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="grid grid-cols-2 items-center">
                    <span className="font-medium text-foreground">Arah</span>
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
                      className="mt-1"
                    />
                  </div>
                ) : (
                  // Layout arah saat view (badge di bawah pair)
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {/* Direction */}
                    <Badge
                      className={`text-xs font-semibold tracking-wide rounded-sm ${
                        formData.direction === "buy"
                          ? "bg-sky-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {formData.direction?.toUpperCase()}
                    </Badge>

                    {/* Result */}
                    <Badge
                      className={`text-xs rounded-sm ${
                        calculateDerivedFields().result === "win"
                          ? "bg-sky-500 text-white"
                          : calculateDerivedFields().result === "loss"
                          ? "bg-red-500 text-white"
                          : "bg-zinc-700 text-white"
                      }`}
                    >
                      {calculateDerivedFields().result.toUpperCase()}
                    </Badge>

                    {/* Profit / Loss */}
                    <Badge
                      className={`text-xs rounded-sm ${
                        calculateDerivedFields().profitLoss > 0
                          ? "bg-sky-500 text-white"
                          : calculateDerivedFields().profitLoss < 0
                          ? "bg-red-500 text-white"
                          : "bg-zinc-700 text-white"
                      }`}
                    >
                      PnL {formatDollar(calculateDerivedFields().profitLoss)}
                    </Badge>

                    {/* Risk Ratio */}
                    <Badge className="bg-zinc-900 text-white text-xs rounded-sm">
                      RR {formatDecimal(calculateDerivedFields().riskRatio)}
                    </Badge>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 text-sm text-white">
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
                    ) : journal.psychologies &&
                      journal.psychologies.length > 0 ? (
                      journal.psychologies.map((p) => (
                        <Badge
                          key={p.psychology.id}
                          variant="secondary"
                          className="text-xs bg-zinc-900 mr-1 text-foreground"
                        >
                          {p.psychology.name}
                        </Badge>
                      ))
                    ) : (
                      <span className="italic">Tidak ada</span>
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
                    <Field key={field} label={fieldLabels[field]}>
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
                  <div className="bg-foreground/5 rounded-md py-2 px-4 w-full col-span-3 mt-0 h-full">
                    <span className="font-medium text-foreground mb-2 flex justify-between items-center">
                      Catatan
                    </span>
                    {isEditing ? (
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Tulis catatan..."
                        className="w-full rounded-md border border-muted bg-background p-3 text-sm text-foreground resize-none min-h-[120px] focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    ) : notes.trim() ? (
                      <div className="rounded-md p-3 text-sm text-foreground whitespace-pre-line">
                        {notes}
                      </div>
                    ) : (
                      <span className="italic text-muted-foreground">
                        Tidak ada catatan
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Kanan: Screenshot */}
              <div className="col-span-1 overflow-y-auto p-2 bg-zinc-900 rounded-md space-y-2 h-fit">
                {isEditing ? (
                  <>
                    {/* BEFORE */}
                    <LabelInputContainer>
                      <p className="text-sm font-medium">Before</p>
                      {screenshots.find((s) => s.type === "BEFORE") &&
                      !showUploadBefore ? (
                        <div className="relative">
                          <Image
                            unoptimized
                            src={
                              screenshots.find((s) => s.type === "BEFORE")!.url
                            }
                            alt="Before"
                            width={400}
                            height={400}
                            className="rounded-md border border-zinc-800 object-cover aspect-square w-full max-h-44"
                          />
                          <button
                            onClick={() => {
                              const screenshot = screenshots.find(
                                (s) => s.type === "BEFORE"
                              );

                              // Jika screenshot berasal dari blob (tidak ada file lokalnya)
                              if (screenshot?.url && !screenshot.file) {
                                setDeletedUrls((prev) => [
                                  ...prev,
                                  screenshot.url,
                                ]);
                              }

                              // Hapus dari state lokal & munculkan uploader lagi
                              setScreenshots((prev) =>
                                prev.filter((s) => s.type !== "BEFORE")
                              );
                              setShowUploadBefore(true);
                            }}
                            className="absolute top-1 right-1 bg-zinc-500 hover:text-foreground/25 text-white text-xs p-1 rounded-md z-10 cursor-pointer"
                          >
                            <XIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="bg-red-400 max-h-48 flex">
                          <FileUpload
                            mode="manual"
                            role="BEFORE"
                            hidePreview
                            files={beforeFiles}
                            setFiles={setBeforeFiles}
                            onChange={(filesOrUrls) => {
                              const file = filesOrUrls.find(
                                (f) => f instanceof File
                              );
                              if (file) {
                                handleScreenshotUpload(file, "BEFORE");
                                setShowUploadBefore(false);
                              }
                            }}
                          />
                        </div>
                      )}
                    </LabelInputContainer>

                    {/* AFTER */}
                    <LabelInputContainer>
                      <p className="text-sm font-medium">After</p>
                      {screenshots.find((s) => s.type === "AFTER") &&
                      !showUploadAfter ? (
                        <div className="relative">
                          <Image
                            unoptimized
                            src={
                              screenshots.find((s) => s.type === "AFTER")!.url
                            }
                            alt="After"
                            width={400}
                            height={400}
                            className="rounded-md border border-zinc-800 object-cover aspect-square w-full max-h-44"
                          />
                          <button
                            onClick={() => {
                              setScreenshots((prev) =>
                                prev.filter((s) => s.type !== "AFTER")
                              );
                              setShowUploadAfter(true);
                            }}
                            className="absolute top-1 right-1 bg-zinc-500 hover:text-foreground/25 text-white text-xs p-1 rounded-md z-10 cursor-pointer"
                          >
                            <XIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <FileUpload
                          mode="manual"
                          role="AFTER"
                          hidePreview
                          files={afterFiles}
                          setFiles={setAfterFiles}
                          onChange={(filesOrUrls) => {
                            const file = filesOrUrls.find(
                              (f) => f instanceof File
                            );
                            if (file) {
                              handleScreenshotUpload(file, "AFTER");
                              setShowUploadAfter(false);
                            }
                          }}
                        />
                      )}
                    </LabelInputContainer>
                  </>
                ) : (
                  ["BEFORE", "AFTER"].map((type) => {
                    const image = journal.screenshots.find(
                      (s) => s.type === type
                    );
                    return (
                      <div key={type} className="flex flex-col justify-center">
                        <p className="text-md font-semibold">
                          {type.charAt(0) + type.slice(1).toLowerCase()}
                        </p>
                        {image ? (
                          <Image
                            unoptimized
                            src={image.url}
                            alt={type}
                            width={400}
                            height={400}
                            className="rounded-md border border-zinc-800 object-cover aspect-square w-full max-h-44"
                          />
                        ) : (
                          <p className="text-[14px] italic text-muted-foreground">
                            Tidak ada gambar {type.toLowerCase()}
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 sticky bottom-0 px-4 py-3 z-50 bg-background flex justify-end gap-2">
            {isEditing ? (
              <>
                <SaveChangesButton<TradePayload>
                  type="trade"
                  id={journal.id}
                  disabled={isPending}
                  onSuccess={() => {
                    setIsEditing(false);
                    setDeletedUrls([]);
                  }}
                  payload={preparePayloadBeforeSave}
                />

                <Button variant="ghost" onClick={() => setIsEditing(false)}>
                  Batal
                </Button>
                <DeleteButton
                  id={journal.id}
                  type="trade"
                  onSuccess={() => setOpenDialog(false)}
                />
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            )}
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
