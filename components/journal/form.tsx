"use client";

import React from "react";
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
import { FileUpload } from "../ui/file-upload";
import { SubmitButton } from "../button";
import { notifyError, notifySuccess } from "../asset/notify";
import { PsychologySelect } from "../select/psychology-select";
import LabelInputContainer from "../asset/label-input";
import FieldError from "../asset/field-error";

type TradeFormProps = {
  pairs: { id: string; symbol: string }[];
  setupTrades: { id: string; name: string }[];
};

type Option = {
  label: string;
  value: string;
};

type Psychology = {
  id: string;
  name: string;
};

export default function TradeForm({ pairs, setupTrades,  }: TradeFormProps) {
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

  const [date, setDate] = React.useState<Date>(
    state.values.date ? new Date(state.values.date) : new Date()
  );
  const [direction, setDirection] = React.useState<string>(
    state.values.direction || ""
  );
  const [pairId, setPairId] = React.useState<string>(state.values.pairId || "");
  const [setupTradeId, setSetupTradeId] = React.useState<string>("");


  const [entryPrice, setEntryPrice] = React.useState<number>(0);
  const [exitPrice, setExitPrice] = React.useState<number>(0);
  const [lotSize, setLotSize] = React.useState<number | "">(0.01);
  const [takeProfit, setTakeProfit] = React.useState<number>(0);
  const [stoploss, setStoploss] = React.useState<number>(0);

  const [result, setResult] = React.useState<string>("");
  const [riskRatio, setRiskRatio] = React.useState<string>("");
  const [profitLoss, setProfitLoss] = React.useState<string>("");
  const [screenshotUrl, setScreenshotUrl] = React.useState<string>("");

  const [selectedPsychologies, setSelectedPsychologies] = React.useState<
    Option[]
  >([]);

  const [availablePsychologies, setAvailablePsychologies] = React.useState<
    Option[]
  >([]);

  React.useEffect(() => {
    fetch("/api/psychologies")
      .then((res) => res.json())
      .then((data: { psychologies: Psychology[] }) => {
        setAvailablePsychologies(
          data.psychologies.map((p) => ({
            label: p.name,
            value: p.id,
          }))
        );
      });
  }, []);

  const handleSubmit = async (formData: FormData) => {
    const psychologyIds = selectedPsychologies.map((p) => p.value);
    formData.set("psychologies", JSON.stringify(psychologyIds));
    formData.set("setupTradeId", setupTradeId);
    formAction(formData);
  };

  React.useEffect(() => {
    if (state.message) {
      if (state.errors && Object.keys(state.errors).length > 0) {
        notifyError("Gagal menyimpan trade.");
      } else {
        notifySuccess(state.message);

        // Reset form ke nilai awal
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
        setScreenshotUrl("");
        setSelectedPsychologies([]);
      }
    }
  }, [state]);

  React.useEffect(() => {
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
    if (direction === "buy") {
      if (exitPrice > entryPrice) _result = "win";
      else if (exitPrice < entryPrice) _result = "loss";
    } else if (direction === "sell") {
      if (exitPrice < entryPrice) _result = "win";
      else if (exitPrice > entryPrice) _result = "loss";
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
          <input type="hidden" name="date" value={date.toISOString()} />
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
          options={pairs.map((pair) => ({
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
              options={setupTrades.map(s => ({ value: s.id, label: s.name }))}
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

      {/* Screenshot URL */}
      <LabelInputContainer>
        <FileUpload
          onChange={(urls) => {
            const url = urls[0];
            setScreenshotUrl(url); // simpan di state
          }}
        />
        <input type="hidden" name="screenshotUrl" value={screenshotUrl} />
        <FieldError>{state.errors?.screenshotUrl}</FieldError>
      </LabelInputContainer>

      {/* Buttons */}
      <div className="flex justify-end mt-10">
        <SubmitButton />
      </div>
    </form>
  );
}
