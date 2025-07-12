"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EllipsisHorizontalIcon from "@heroicons/react/24/solid/EllipsisHorizontalIcon";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { SaveChangesButton } from "../button";
import { Input } from "@/components/ui/input";
import { useState, useTransition, useEffect } from "react";
import LabelInputContainer from "../asset/label-input";
import { TimeframeSelect } from "@/components/select/timeframe-select";
import { IndicatorSelect } from "../select/indicator-select";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import type { SetupPayload } from "@/components/button";
import { useQueryClient } from "@tanstack/react-query";
import { notifyError, notifySuccess } from "../asset/notify";
import { ConfirmDialog } from "../asset/confirm-dialog";
import { TrashIcon } from "@heroicons/react/24/solid";

type Setup = {
  id: string;
  name: string;
  strategy: string;
  notes?: string | null;
  winrate?: number | null;
  journals?: { id: string }[];
  indicators?: { id: string; name: string; code: string }[];
  timeframes?: { id: string; name: string }[];
};

type Props = {
  setup: Setup;
  timeframe: { id: string; name: string }[];
  indicator: { id: string; name: string; code: string }[];
};

export default function SetupTradeDetailDialog({
  setup,
  timeframe,
  indicator,
}: Props) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: setup.name,
    strategy: setup.strategy,
    notes: setup.notes ?? "",
  });
  const [selectedIndicators, setSelectedIndicators] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedTimeframes, setSelectedTimeframes] = useState<
    { label: string; value: string }[]
  >([]);
  const [isPending] = useTransition();

  useEffect(() => {
    if (setup.indicators) {
      setSelectedIndicators(
        setup.indicators.map((i) => ({
          label: `${i.name} (${i.code})`,
          value: i.id,
        }))
      );
    }
    if (setup.timeframes) {
      setSelectedTimeframes(
        setup.timeframes.map((t) => ({
          label: t.name,
          value: t.id,
        }))
      );
    }
  }, [setup]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [openTooltip, setOpenTooltip] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const queryClient = useQueryClient();

  const handleClick = () => {
    setOpenTooltip(false); // Tutup tooltip
    setOpenDialog(true); // Buka dialog
  };

  const handleDelete = async () => {
  if (setup.journals && setup.journals.length > 0) {
    notifyError("Setup ini sedang digunakan, hapus jurnal terlebih dahulu.");
    return;
  }

  try {
    const res = await fetch(`/api/setup/${setup.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data?.error || "Gagal menghapus setup.");
    }

    queryClient.invalidateQueries({ queryKey: ["setup-trade"] });
    setOpenDialog(false);

    // ✅ Tambahkan notifikasi sukses
    notifySuccess("Setup berhasil dihapus.");
  } catch (err: unknown) {
    if (err instanceof Error) {
      notifyError(err.message);
    } else {
      notifyError("Terjadi kesalahan yang tidak diketahui.");
    }
  }
};


  return (
    <>
      <Tooltip open={openTooltip} onOpenChange={setOpenTooltip}>
        <TooltipTrigger asChild>
          <Button
            onClick={handleClick}
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-sm p-0 cursor-pointer bg-zinc-950 hover:bg-zinc-900 hover:text-white"
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
          if (!isOpen) {
            setOpenTooltip(false);
          }
        }}
      >
        <DialogContent
          className="w-[480px] px-2 py-4 rounded-2xl bg-background overflow-hidden"
          style={{ minHeight: "90vh" }}
          showCloseButton={false}
        >
          <div className="flex flex-col min-h-full">
            <div className="sticky top-0 z-50 bg-background">
              <div className="flex justify-between items-center py-4">
                <DialogTitle className="text-2xl font-bold">
                  Detail Setup
                </DialogTitle>
                <DialogPrimitive.Close asChild>
                  <button className="cursor-pointer text-white">
                    <XIcon className="w-5 h-5" />
                  </button>
                </DialogPrimitive.Close>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-5 text-sm text-muted-foreground px-2 mt-2">
              <div className="grid grid-cols-3 gap-y-2">
                <span className="font-medium text-foreground">Nama Setup</span>
                <span className="col-span-2 text-foreground mb-2">
                  {editMode ? (
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  ) : (
                    setup.name
                  )}
                </span>

                <span className="font-medium text-foreground">Strategi</span>
                <span className="col-span-2 italic text-foreground mb-2">
                  {editMode ? (
                    <Input
                      name="strategy"
                      value={formData.strategy}
                      onChange={handleChange}
                    />
                  ) : (
                    setup.strategy
                  )}
                </span>

                <span className="font-medium text-foreground">Winrate</span>
                <span className="col-span-2">
                  {setup.winrate !== null && setup.winrate !== undefined ? (
                    <Badge
                      variant="default"
                      className={`text-xs px-2 py-1 rounded-md ${
                        setup.winrate === 0
                          ? "bg-zinc-700 text-white"
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
                </span>
              </div>

              <div>
                <div className="font-medium text-foreground mb-1">
                  Timeframe
                </div>
                {editMode ? (
                  <LabelInputContainer>
                    <TimeframeSelect
                      name="timeframe"
                      selected={selectedTimeframes}
                      onChange={setSelectedTimeframes}
                      options={timeframe.map((t) => ({
                        label: t.name,
                        value: t.id,
                      }))}
                      placeholder="Pilih Timeframe"
                    />
                  </LabelInputContainer>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {setup.timeframes?.map((tf) => (
                      <Badge
                        key={tf.id}
                        variant="secondary"
                        className="text-xs rounded-md bg-zinc-900 text-foreground"
                      >
                        {tf.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="font-medium text-foreground mb-1">
                  Indikator
                </div>
                {editMode ? (
                  <LabelInputContainer>
                    <IndicatorSelect
                      name="indicatorIds"
                      selected={selectedIndicators}
                      onChange={setSelectedIndicators}
                      options={indicator.map((i) => ({
                        label: `${i.name} (${i.code})`,
                        value: i.id,
                      }))}
                      placeholder="Pilih Indikator"
                    />
                  </LabelInputContainer>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {setup.indicators?.map((ind) => (
                      <Badge
                        key={ind.id}
                        variant="secondary"
                        className="text-xs rounded-md bg-zinc-900 text-foreground"
                      >
                        {ind.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-zinc-950 rounded-md min-h-[120px] py-2 mb-10 px-4">
                <div className="font-medium text-foreground mb-3">Catatan</div>
                {editMode ? (
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full rounded-md border border-muted bg-background p-3 text-sm text-foreground resize-none min-h-[120px] focus:outline-none focus:ring-2 focus:ring-ring "
                  />
                ) : setup.notes?.trim() ? (
                  <div className="rounded-md p-3 text-sm text-foreground">
                    {setup.notes}
                  </div>
                ) : (
                  <span className="italic text-muted-foreground">
                    Tidak ada catatan
                  </span>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t h-full border-zinc-800 pt-4 px-2 bg-background sticky bottom-0 z-50">
              <div className="flex justify-end gap-2">
                {editMode ? (
                  <>
                    <SaveChangesButton<SetupPayload>
                      type="setup"
                      id={setup.id}
                      payload={{
                        ...formData,
                        indicatorIds: selectedIndicators.map((i) => i.value),
                        timeframe: selectedTimeframes.map((t) => t.value),
                      }}
                      disabled={isPending}
                      onSuccess={() => {
                        queryClient.invalidateQueries({
                          queryKey: ["setup-trade"],
                        });
                        setEditMode(false);
                      }}
                    />
                    <Button
                      variant="ghost"
                      onClick={() => setEditMode(false)}
                      disabled={isPending}
                    >
                      Batal
                    </Button>
                    <ConfirmDialog
                      trigger={
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={isPending}
                        >
                          <TrashIcon className="w-4 h-4 mr-2" />
                          Hapus
                        </Button>
                      }
                      title="Konfirmasi Hapus"
                      description="Apakah kamu yakin ingin menghapus setup ini? Data tidak bisa dikembalikan."
                      confirmText="Ya, Hapus"
                      cancelText="Batal"
                      onConfirm={handleDelete}
                    />
                  </>
                ) : (
                  <div className="">
                    <Button onClick={() => setEditMode(true)} size="sm">
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
