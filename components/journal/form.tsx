"use client";

import React from "react";
import { useActionState } from "react";
import { createTrade } from "@/lib/actions/trade";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { DatePickerWithPresets } from "@/components/asset/date-picker";
import { DropdownMenuSelect } from "../asset/dropdown-menu";
import { ComboBox } from "../asset/combo-box";

type TradeFormProps = {
  pairs: { id: string; symbol: string }[];
};

export default function TradeForm({ pairs }: TradeFormProps) {
  const initialState = {
    message: "",
    errors: {} as Record<string, string[] | string>,
    values: {
      pairId: "",
      direction: "",
      date: new Date().toISOString(),
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

  // Input states
  const [entryPrice, setEntryPrice] = React.useState<number>(0);
  const [exitPrice, setExitPrice] = React.useState<number>(0);
  const [lotSize, setLotSize] = React.useState<number>(1);
  const [takeProfit, setTakeProfit] = React.useState<number>(0);
  const [stoploss, setStoploss] = React.useState<number>(0);

  // Auto-calculated fields
  const [result, setResult] = React.useState<string>("");
  const [riskRatio, setRiskRatio] = React.useState<string>("");
  const [profitLoss, setProfitLoss] = React.useState<string>("");

  React.useEffect(() => {
    // Result
    let _result = "bep";
    if (entryPrice && exitPrice) {
      if (direction === "buy") {
        if (exitPrice > entryPrice) _result = "win";
        else if (exitPrice < entryPrice) _result = "loss";
      } else if (direction === "sell") {
        if (exitPrice < entryPrice) _result = "win";
        else if (exitPrice > entryPrice) _result = "loss";
      }
    }

    // RR
    const rr = Math.abs(takeProfit - entryPrice) / Math.abs(entryPrice - stoploss);
    const _rr = isFinite(rr) ? rr.toFixed(2) : "";

    // P/L
    const priceDiff =
      direction === "buy"
        ? exitPrice - entryPrice
        : entryPrice - exitPrice;
    const pl = priceDiff * lotSize;
    const _pl = isFinite(pl) ? pl.toFixed(2) : "";

    setResult(_result);
    setRiskRatio(_rr);
    setProfitLoss(_pl);
  }, [entryPrice, exitPrice, lotSize, takeProfit, stoploss, direction]);

  return (
    <form action={formAction} className="space-y-4">
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
          <input type="hidden" name="direction" value={direction} />

          {state.errors?.direction && (
            <p className="text-[10px] text-red-600 font-light -mt-1.5">{state.errors.direction}</p>
          )}
        </LabelInputContainer>

      </div>

      {/* Pair */}
      <LabelInputContainer>
        <ComboBox
          name="pairId"
          value={pairId}
          onChange={setPairId}
          options={pairs.map((pair) => ({
            value: pair.id,
            label: pair.symbol,
          }))}
        />
        <input type="hidden" name="pairId" value={pairId} />
        {state.errors?.direction && (
          <p className="text-[10px] text-red-600 font-light -mt-1.5">{state.errors.pairId}</p>
        )}
      </LabelInputContainer>

      {/* Entry & Exit */}
      <div className="flex gap-4">
        <LabelInputContainer>
          <Input
            name="entryPrice"
            type="number"
            placeholder="Entry"
            className="no-spinner"
            onChange={(e) => setEntryPrice(parseFloat(e.target.value))}
          />
          <FieldError>{state.errors?.entryPrice}</FieldError>
        </LabelInputContainer>
        <LabelInputContainer>
          <Input
            name="exitPrice"
            type="number"
            placeholder="Exit"
            className="no-spinner"
            onChange={(e) => setExitPrice(parseFloat(e.target.value))}
          />
          <FieldError>{state.errors?.exitPrice}</FieldError>
        </LabelInputContainer>
      </div>

      {/* Lot, TP, SL */}
      <div className="flex gap-4">
        <LabelInputContainer>
          <Input
            name="lotSize"
            type="number"
            placeholder="Lot"
            className="no-spinner"
            value={lotSize}
            onChange={(e) => setLotSize(parseFloat(e.target.value))}
          />
          <FieldError>{state.errors?.lotSize}</FieldError>
        </LabelInputContainer>
        <LabelInputContainer>
          <Input
            name="takeProfit"
            type="number"
            placeholder="TakeProfit"
            className="no-spinner"
            onChange={(e) => setTakeProfit(parseFloat(e.target.value))}
          />
          <FieldError>{state.errors?.takeProfit}</FieldError>
        </LabelInputContainer>
        <LabelInputContainer>
          <Input
            name="stoploss"
            type="number"
            placeholder="StopLoss"
            className="no-spinner"
            onChange={(e) => setStoploss(parseFloat(e.target.value))}
          />
          <FieldError>{state.errors?.stoploss}</FieldError>
        </LabelInputContainer>
      </div>

      {/* Result, RR, P/L */}
      <div className="flex gap-4">
        <LabelInputContainer>
          <Input
            name="result"
            placeholder="Result"
            value={result}
            readOnly
          />
          <FieldError>{state.errors?.result}</FieldError>
        </LabelInputContainer>
        <LabelInputContainer>
          <Input
            name="riskRatio"
            type="number"
            placeholder="RR"
            value={riskRatio}
            readOnly
          />
          <FieldError>{state.errors?.riskRatio}</FieldError>
        </LabelInputContainer>
        <LabelInputContainer>
          <Input
            name="profitLoss"
            type="number"
            placeholder="P/L"
            value={profitLoss}
            readOnly
          />
          <FieldError>{state.errors?.profitLoss}</FieldError>
        </LabelInputContainer>
      </div>

      {/* Psychology & Strategi */}
      <div className="flex gap-4">
        <LabelInputContainer>
          <Input name="psychology" placeholder="Psikologi" />
          <FieldError>{state.errors?.psychology}</FieldError>
        </LabelInputContainer>
        <LabelInputContainer>
          <Input name="strategi" placeholder="Strategi" />
          <FieldError>{state.errors?.strategi}</FieldError>
        </LabelInputContainer>
      </div>

      {/* Notes */}
      <LabelInputContainer>
        <Textarea name="notes" placeholder="Catatan" />
        <FieldError>{state.errors?.notes}</FieldError>
      </LabelInputContainer>

      {/* Screenshot URL */}
      <LabelInputContainer>
        <Input name="screenshotUrl" type="url" placeholder="URL Gambar" />
        <FieldError>{state.errors?.screenshotUrl}</FieldError>
      </LabelInputContainer>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="reset" variant="outline">
          Batal
        </Button>
        <Button type="submit">Simpan</Button>
      </div>
    </form>
  );
}

// Shared UI layout
const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>
);

const FieldError = ({ children }: { children?: string | string[] }) => {
  if (!children) return null;
  return (
    <div className="-mt-3 ml-1">
      <span className="text-xs text-red-700">
        {Array.isArray(children) ? children.join(", ") : children}
      </span>
    </div>
  );
};
