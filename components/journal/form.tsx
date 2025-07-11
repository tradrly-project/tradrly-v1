"use client";

import React, { useState, useEffect, startTransition } from "react";
import { useActionState } from "react";
import { createTrade } from "@/lib/actions/trade";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePickerWithPresets } from "@/components/asset/date-picker";
import { DropdownMenuSelect } from "../select/direction";
import { ComboBox } from "../asset/combo-box";
import { FloatingLabelInput } from "../asset/floating-placeholder";
import { RightPlaceholderInput } from "../asset/placeholder-right";
import { LeftPlaceholderInput } from "../asset/placeholder-left";
import { FileUpload, FileWithMeta } from "../ui/file-upload";
import { SubmitButton } from "../button";
import { notifyError, notifySuccess } from "../asset/notify";
import { PsychologySelect } from "../select/psychology-select";
import LabelInputContainer from "../asset/label-input";
import FieldError from "../asset/field-error";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { fetchUserPsychologies } from "@/lib/api/psychology";
import { useMemo } from "react";

type TradeFormProps = {
  userPairs: { id: string; symbol: string }[];
  setupTrades: { id: string; name: string }[];
};

type UserPsychology = {
  id: string;
  customName?: string;
  hidden?: boolean;
  psychology: {
    id: string;
    name: string;
    category?: string;
  };
};

type Option = { label: string; value: string };
type Screenshot = { type: "BEFORE" | "AFTER"; url: string; file?: File };

export default function TradeForm({ userPairs, setupTrades }: TradeFormProps) {
  const initialState = {
    message: "",
    errors: {} as Record<string, string[] | string>,
    values: {
      pairId: "",
      direction: "",
      date: new Date().toISOString(),
      setupTradeId: "",
    },
  };

  const [state, formAction] = useActionState(createTrade, initialState);
  const queryClient = useQueryClient();

  const [date, setDate] = React.useState<Date>(
    new Date(state.values.date ?? Date.now())
  );
  const [direction, setDirection] = useState(state.values.direction || "");
  const [pairId, setPairId] = useState(state.values.pairId || "");
  const [setupTradeId, setSetupTradeId] = useState("");

  const [entryPrice, setEntryPrice] = useState(0);
  const [exitPrice, setExitPrice] = useState(0);
  const [lotSize, setLotSize] = useState<number | "">(0.01);
  const [takeProfit, setTakeProfit] = useState(0);
  const [stoploss, setStoploss] = useState(0);

  const [result, setResult] = useState("");
  const [riskRatio, setRiskRatio] = useState("");
  const [profitLoss, setProfitLoss] = useState("");

  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [beforeFiles, setBeforeFiles] = useState<FileWithMeta[]>([]);
  const [afterFiles, setAfterFiles] = useState<FileWithMeta[]>([]);

  const [selectedPsychologies, setSelectedPsychologies] = useState<Option[]>(
    []
  );
  const {
  data: userPsychologies = [],
} = useQuery({
  queryKey: ["user-psychology"],
  queryFn: fetchUserPsychologies,
});


  // Fetch psychology options
  const availablePsychologies: Option[] = useMemo(() => {
  return userPsychologies
    .sort((a: UserPsychology, b: UserPsychology) => {
      const nameA = (a.customName || a.psychology?.name || "").toLowerCase();
      const nameB = (b.customName || b.psychology?.name || "").toLowerCase();
      return nameA.localeCompare(nameB);
    })
    .map((item: UserPsychology) => ({
      label: item.customName || item.psychology?.name || "Tanpa Nama",
      value: item.id,
    }));
}, [userPsychologies]);


  // Submit handler
  const handleSubmit = async (formData: FormData) => {
    const uploadedScreenshots = await Promise.all(
      screenshots.map(async (s) => {
        let url = s.url;

        if (s.file instanceof File) {
          const uploadForm = new FormData();
          uploadForm.append("file", s.file);
          const res = await fetch("/api/file/upload", {
            method: "PUT",
            body: uploadForm,
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Upload failed");
          url = data.url;
        }

        return { type: s.type, url };
      })
    );

    uploadedScreenshots.forEach((s, i) => {
      formData.set(`screenshots[${i}][type]`, s.type);
      formData.set(`screenshots[${i}][url]`, s.url);
    });

    // FIXED: gunakan append bukan set + pakai key `psychology`
    selectedPsychologies.forEach((p) => {
      formData.append("psychology", p.value);
    });
    console.log(
      "Psychologies dikirim:",
      selectedPsychologies.map((p) => p.value)
    );

    formData.set("setupTradeId", setupTradeId);

    startTransition(() => formAction(formData));
  };

  // Show notification + reset form if needed
  useEffect(() => {
    if (state.message) {
      if (Object.keys(state.errors ?? {}).length > 0) {
        notifyError("Gagal menyimpan trade.");
      } else {
        notifySuccess(state.message);

        queryClient.invalidateQueries({ queryKey: ["journal-data"] });

        setEntryPrice(0);
        setExitPrice(0);
        setLotSize(0.01);
        setTakeProfit(0);
        setStoploss(0);
        setPairId("");
        setSetupTradeId("");
        setDirection("");
        setDate(new Date());
        setResult("");
        setRiskRatio("");
        setProfitLoss("");
        setSelectedPsychologies([]);
        setScreenshots([]);
        setBeforeFiles([]);
        setAfterFiles([]);
      }
    }
  }, [queryClient, state]);

  // Auto-calculate result, RR, and profit/loss
  useEffect(() => {
    const allFilled =
      direction &&
      pairId &&
      date &&
      entryPrice > 0 &&
      exitPrice > 0 &&
      lotSize !== "" &&
      lotSize >= 0.01 &&
      takeProfit > 0 &&
      stoploss > 0;

    if (!allFilled) {
      setResult("");
      setRiskRatio("");
      setProfitLoss("");
      return;
    }

    let _result = "bep";
    if (
      (direction === "buy" && exitPrice > entryPrice) ||
      (direction === "sell" && exitPrice < entryPrice)
    ) {
      _result = "win";
    } else if (
      (direction === "buy" && exitPrice < entryPrice) ||
      (direction === "sell" && exitPrice > entryPrice)
    ) {
      _result = "loss";
    }

    const rr =
      Math.abs(takeProfit - entryPrice) / Math.abs(entryPrice - stoploss);
    const _rr = isFinite(rr) ? rr.toFixed(2) : "";

    const priceDiff =
      direction === "buy" ? exitPrice - entryPrice : entryPrice - exitPrice;
    const validLotSize = typeof lotSize === "number" ? lotSize : 0;
    const pl = priceDiff * validLotSize;
    const _pl = isFinite(pl) ? pl.toFixed(2) : "";

    setResult(_result);
    setRiskRatio(_rr);
    setProfitLoss(_pl);
  }, [
    entryPrice,
    exitPrice,
    lotSize,
    takeProfit,
    stoploss,
    direction,
    pairId,
    date,
  ]);

  // Helper untuk handle upload screenshot
  const handleScreenshotUpload = (file: File, type: "BEFORE" | "AFTER") => {
    const previewUrl = URL.createObjectURL(file);
    const updated = screenshots.filter((s) => s.type !== type);
    setScreenshots([...updated, { type, url: previewUrl, file }]);
  };

  return (
    <form action={handleSubmit} className="space-y-4 h-full">
      {/* Date + Direction */}
      <div className="flex gap-4">
        <LabelInputContainer>
          <DatePickerWithPresets
            name="date"
            value={date}
            onChange={setDate}
            error={state.errors?.date}
          />
          <input
            type="hidden"
            name="date"
            value={typeof date === "string" ? date : date.toISOString()}
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <DropdownMenuSelect
            name="direction"
            value={direction}
            onChange={setDirection}
            options={[
              { label: "Buy", value: "buy" },
              { label: "Sell", value: "sell" },
            ]}
          />
          <FieldError>{state.errors?.direction}</FieldError>
        </LabelInputContainer>
      </div>

      {/* Pair */}
      <LabelInputContainer>
        <ComboBox
          name="pairId"
          value={pairId}
          onChange={setPairId}
          placeholder="Pilih Pair"
          options={userPairs.map((pair) => ({
            value: pair.id,
            label: pair.symbol,
          }))}
        />
        <input type="hidden" name="pairId" value={pairId} />
        <FieldError>{state.errors?.pairId}</FieldError>
      </LabelInputContainer>

      {/* Entry & Exit */}
      <div className="flex gap-4">
        <LabelInputContainer>
          <FloatingLabelInput
            name="entryPrice"
            type="number"
            label="Entry Price"
            className="no-spinner h-auto"
            value={entryPrice || ""}
            onChange={(e) => setEntryPrice(parseFloat(e.target.value))}
          />
          <FieldError>{state.errors?.entryPrice}</FieldError>
        </LabelInputContainer>
        <LabelInputContainer>
          <FloatingLabelInput
            name="exitPrice"
            type="number"
            label="Exit Price"
            className="no-spinner h-auto"
            value={exitPrice || ""}
            onChange={(e) => setExitPrice(parseFloat(e.target.value))}
          />
          <FieldError>{state.errors?.exitPrice}</FieldError>
        </LabelInputContainer>
      </div>

      {/* Lot, TP, SL */}
      <div className="flex gap-4">
        <LabelInputContainer>
          <RightPlaceholderInput
            name="lotSize"
            type="number"
            unit="Lot"
            step="0.01"
            min={0.01}
            className="no-spinner"
            value={lotSize === "" ? "" : lotSize}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === "") {
                setLotSize("");
              } else {
                const parsed = parseFloat(raw);
                if (!isNaN(parsed)) {
                  setLotSize(parsed);
                }
              }
            }}
            onBlur={() => {
              if (lotSize === "" || lotSize < 0.01) {
                setLotSize(0.01);
              }
            }}
          />
          <FieldError>{state.errors?.lotSize}</FieldError>
        </LabelInputContainer>

        <LabelInputContainer>
          <LeftPlaceholderInput
            className="no-spinner"
            name="takeProfit"
            type="number"
            unit="TP"
            value={takeProfit || ""}
            onChange={(e) => setTakeProfit(parseFloat(e.target.value))}
          />
          <FieldError>{state.errors?.takeProfit}</FieldError>
        </LabelInputContainer>

        <LabelInputContainer>
          <LeftPlaceholderInput
            className="no-spinner"
            name="stoploss"
            type="number"
            unit="SL"
            value={stoploss || ""}
            onChange={(e) => setStoploss(parseFloat(e.target.value))}
          />
          <FieldError>{state.errors?.stoploss}</FieldError>
        </LabelInputContainer>
      </div>

      {/* Result, RR, P/L */}
      <div className="flex gap-4">
        <LabelInputContainer>
          <Input name="result" placeholder="Result" value={result} readOnly />
          <FieldError>{state.errors?.result}</FieldError>
        </LabelInputContainer>
        <LabelInputContainer>
          <LeftPlaceholderInput
            name="riskRatio"
            type="number"
            unit="RR"
            value={riskRatio}
            readOnly
          />
          <FieldError>{state.errors?.riskRatio}</FieldError>
        </LabelInputContainer>
        <LabelInputContainer>
          <LeftPlaceholderInput
            name="profitLoss"
            type="number"
            unit="P/L"
            value={profitLoss}
            readOnly
          />
          <FieldError>{state.errors?.profitLoss}</FieldError>
        </LabelInputContainer>
      </div>

      <div className="flex gap-4 max-w-[500px] w-full">
        {/* Kolom Psikologi */}
        <div className="flex-1 min-w-0">
          <LabelInputContainer>
            <PsychologySelect
              name="psychology"
              options={availablePsychologies}
              selected={selectedPsychologies}
              onChange={setSelectedPsychologies}
            />
            <FieldError>{state.errors?.psychology}</FieldError>
          </LabelInputContainer>
        </div>

        {/* Kolom SetupTrade */}
        <div className="flex-1 min-w-0">
          <LabelInputContainer className="flex-1">
            <ComboBox
              name="setupTradeId"
              value={setupTradeId}
              onChange={setSetupTradeId}
              placeholder="Pilih Setup Trade"
              options={setupTrades.map((s) => ({ value: s.id, label: s.name }))}
              className="h-[40px]"
            />
            <input type="hidden" name="setupTradeId" value={setupTradeId} />
            <FieldError>{state.errors?.setupTradeId}</FieldError>
          </LabelInputContainer>
        </div>
      </div>

      {/* Notes */}
      <LabelInputContainer>
        <Textarea name="notes" placeholder="Catatan" />
        <FieldError>{state.errors?.notes}</FieldError>
      </LabelInputContainer>

      {/* File Upload Before */}
      <div className="grid grid-cols-2 gap-4">
        {/* Before */}
        <LabelInputContainer>
          <p className="text-sm font-medium">Before</p>
          <FileUpload
            mode="manual"
            role="BEFORE"
            files={beforeFiles}
            setFiles={setBeforeFiles}
            onChange={(filesOrUrls) => {
              const file = filesOrUrls.find((f) => f instanceof File);
              if (file) handleScreenshotUpload(file, "BEFORE");
            }}
          />
        </LabelInputContainer>

        {/* After */}
        <LabelInputContainer>
          <p className="text-sm font-medium">After</p>
          <FileUpload
            mode="manual"
            role="AFTER"
            files={afterFiles}
            setFiles={setAfterFiles}
            onChange={(filesOrUrls) => {
              const file = filesOrUrls.find((f) => f instanceof File);
              if (file) handleScreenshotUpload(file, "AFTER");
            }}
          />
        </LabelInputContainer>
      </div>

      {/* Buttons */}
      <div className="flex justify-end mt-10">
        <SubmitButton />
      </div>
    </form>
  );
}
