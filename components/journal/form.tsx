"use client";

import { useActionState } from "react";
import { createTrade } from "@/lib/actions/trade";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const initialState = {
  message: "",
  errors: {},
};

type TradeFormProps = {
  pairs: { id: string; symbol: string }[];
};

export default function TradeForm({ pairs }: TradeFormProps) {
  const [state, formAction] = useActionState(createTrade, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex gap-2">
        <LabelInputContainer>
          <Input name="date" type="date" />
          <FieldError>{state.errors?.date}</FieldError>
        </LabelInputContainer>
        <LabelInputContainer>
          <Input name="direction" placeholder="Posisi (buy/sell)" />
          <FieldError>{state.errors?.direction}</FieldError>
        </LabelInputContainer>
      </div>

      <LabelInputContainer>
        <select name="pairId" id="pairId" className="border rounded px-2 py-1">
          <option value="">-- Pilih Pair --</option>
          {pairs.map((pair) => (
            <option key={pair.id} value={pair.id}>
              {pair.symbol}
            </option>
          ))}
        </select>
        <FieldError>{state.errors?.pairId}</FieldError>
      </LabelInputContainer>

      <div className="flex gap-2">
        <LabelInputContainer>
          <Input name="entryPrice" type="number" placeholder="Entry" />
          <FieldError>{state.errors?.entryPrice}</FieldError>
        </LabelInputContainer>
        <LabelInputContainer>
          <Input name="takeProfit" type="number" placeholder="TakeProfit" />
          <FieldError>{state.errors?.takeProfit}</FieldError>
        </LabelInputContainer>
      </div>

      <div className="flex gap-2">
        <LabelInputContainer>
          <Input name="stoploss" type="number" placeholder="StopLoss" />
          <FieldError>{state.errors?.stoploss}</FieldError>
        </LabelInputContainer>
        <LabelInputContainer>
          <Input name="exitPrice" type="number" placeholder="Exit" />
          <FieldError>{state.errors?.exitPrice}</FieldError>
        </LabelInputContainer>
      </div>

      <div className="flex gap-2">
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

      <div className="flex gap-2">
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

      {state.message && <p className="text-sm text-red-600">{state.message}</p>}

      <div className="flex justify-end gap-2 pt-2">
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
  <div className={cn("flex w-full flex-col space-y-2", className)}>
    {children}
  </div>
);

const FieldError = ({ children }: { children?: string | string[] }) => {
  if (!children) return null;
  return (
    <div className="-mt-3 ml-2">
      <span className="text-xs text-red-700">
        {Array.isArray(children) ? children.join(", ") : children}
      </span>
    </div>
  );
};
