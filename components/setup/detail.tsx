"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EllipsisHorizontalIcon from "@heroicons/react/24/solid/EllipsisHorizontalIcon";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { DeleteButton, SaveChangesButton } from "../button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useTransition, useEffect } from "react";
import LabelInputContainer from "../asset/label-input";
import { TimeframeSelect } from "@/components/select/timeframe-select";
import { IndicatorSelect } from "../select/indicator-select";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import type { SetupPayload } from "@/components/button";

type Setup = {
  id: string;
  name: string;
  strategy: string;
  notes?: string | null;
  winrate?: number | null;
  indicators?: { id: string; name: string; code: string }[];
  timeframes?: { id: string; code: string }[];
};

type Props = {
  setup: Setup;
  timeframe: { id: string; code: string }[];
  indicator: { id: string; name: string; code: string }[];
};

export function SetupTradeDetailDialog({ setup, timeframe, indicator }: Props) {
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
          label: t.code,
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

  const handleClick = () => {
    setOpenTooltip(false); // Tutup tooltip
    setOpenDialog(true); // Buka dialog
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
          if (!isOpen) {
            setOpenTooltip(false);
          }
        }}
      >
        <DialogContent
          className="w-[480px] p-0 rounded-2xl overflow-y-auto bg-background"
          style={{ maxHeight: "90vh" }}
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

            <div className="space-y-5 text-sm text-muted-foreground px-2 mt-6">
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
                      className={`text-xs px-2 py-1 rounded-md ${setup.winrate === 0
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
                        label: t.code,
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
                        {tf.code}
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

              <div className="bg-zinc-950 rounded-md h-full py-2 px-4">
                <div className="font-medium text-foreground mb-3">Catatan</div>
                {editMode ? (
                  <Textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="border-zinc-800 mb-2"
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

            <div className="sticky bottom-0 bg-background pt-6 mt-12 border-t border-zinc-800 flex justify-end">
              {editMode ? (
                <div className="flex gap-2 transition-all duration-200">
                  <DeleteButton
                    type="setup"
                    id={setup.id}
                    title="Yakin ingin menghapus setup ini?"
                    description="Setup yang dihapus tidak bisa dikembalikan."
                  />
                  <Button
                    variant="ghost"
                    onClick={() => setEditMode(false)}
                    disabled={isPending}
                  >
                    Batal
                  </Button>
                  <SaveChangesButton<SetupPayload>
                    type="setup"
                    id={setup.id}
                    payload={{
                      ...formData,
                      indicatorIds: selectedIndicators.map((i) => i.value),
                      timeframe: selectedTimeframes.map((t) => t.value),
                    }}
                    disabled={isPending}
                    onSuccess={() => setEditMode(false)}
                  />
                </div>
              ) : (
                <Button onClick={() => setEditMode(true)} size="sm">
                  Edit
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
