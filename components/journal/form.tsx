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

  return (
    <form action={formAction} className="space-y-4">
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
            error={state.errors?.direction}
          />
          <input type="hidden" name="direction" value={direction} />
        </LabelInputContainer>
      </div>

      <LabelInputContainer>
        <ComboBox
          name="pairId"
          value={pairId}
          onChange={setPairId}
          options={pairs.map((pair) => ({
            value: pair.id,
            label: pair.symbol,
          }))}
          error={state.errors?.pairId}
        />
        <input type="hidden" name="pairId" value={pairId} />
      </LabelInputContainer>

      <div className="flex gap-4">
        <LabelInputContainer>
          <Input name="entryPrice" type="number" placeholder="Entry" />
          <FieldError>{state.errors?.entryPrice}</FieldError>
        </LabelInputContainer>
        <LabelInputContainer>
          <Input name="takeProfit" type="number" placeholder="TakeProfit" />
          <FieldError>{state.errors?.takeProfit}</FieldError>
        </LabelInputContainer>
      </div>

      <div className="flex gap-4">
        <LabelInputContainer>
          <Input name="stoploss" type="number" placeholder="StopLoss" />
          <FieldError>{state.errors?.stoploss}</FieldError>
        </LabelInputContainer>
        <LabelInputContainer>
          <Input name="exitPrice" type="number" placeholder="Exit" />
          <FieldError>{state.errors?.exitPrice}</FieldError>
        </LabelInputContainer>
      </div>

      <div className="flex gap-4">
        <LabelInputContainer>
          <Input name="result" placeholder="Result (win/loss/bep)" />
          <FieldError>{state.errors?.result}</FieldError>
        </LabelInputContainer>
        <LabelInputContainer>
          <Input name="riskRatio" type="number" placeholder="RR" />
          <FieldError>{state.errors?.riskRatio}</FieldError>
        </LabelInputContainer>
        <LabelInputContainer>
          <Input name="profitLoss" type="number" placeholder="P/L" />
          <FieldError>{state.errors?.profitLoss}</FieldError>
        </LabelInputContainer>
      </div>

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

      <LabelInputContainer>
        <Textarea name="notes" placeholder="Catatan" />
        <FieldError>{state.errors?.notes}</FieldError>
      </LabelInputContainer>

      <LabelInputContainer>
        <Input name="screenshotUrl" type="url" placeholder="URL Gambar" />
        <FieldError>{state.errors?.screenshotUrl}</FieldError>
      </LabelInputContainer>

      {state.message && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button type="reset" variant="outline">
          Batal
        </Button>
        <Button type="submit">Simpan</Button>
      </div>
    </form>
  );
}

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
