"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createSetupTrade } from "@/lib/actions/setup-trade";
import { SubmitButton } from "../button";
import { notifySuccess, notifyError } from "../asset/notify";
import { IndicatorSelect } from "../asset/indicator-select";
import { SetupTradeFormState } from "@/lib/types";

type SetupTradeFormProps = {
  indicator: { id: string; name: string; code: string }[];
};

export default function SetupTradeForm({ indicator }: SetupTradeFormProps) {
  const initialState = {
    message: "",
    errors: undefined,
    values: {
      name: "",
      strategy: "",
      timeframe: "",
      notes: "",
      indicator: [] as string[], // ✅ FIXED: harus array
    },
  };

  const [state, setState] = useState<SetupTradeFormState>(initialState);
  const [selectedIndicators, setSelectedIndicators] = useState<
    { label: string; value: string }[]
  >([]);

  const handleSubmit = async (formData: FormData) => {
    const indicatorIds = selectedIndicators.map((i) => i.value);
    indicatorIds.forEach((id) => formData.append("indicator", id));

    const result = await createSetupTrade(state, formData);
    setState(result);
  };

  useEffect(() => {
    if (state.message) {
      if (state.errors && Object.keys(state.errors).length > 0) {
        notifyError("Gagal menyimpan setup trade.");
      } else {
        notifySuccess(state.message);
        setSelectedIndicators([]);
      }
    }
  }, [state]);

  return (
    <form action={handleSubmit} className="space-y-6 h-full">
      {/* Nama Setup */}
      <LabelInputContainer>
        <Input name="name" placeholder="Nama Setup" defaultValue={state.values.name} />
        <FieldError>{state.errors?.name}</FieldError>
      </LabelInputContainer>

      {/* Strategi */}
      <LabelInputContainer>
        <Input name="strategy" placeholder="Strategi" defaultValue={state.values.strategy} />
        <FieldError>{state.errors?.strategy}</FieldError>
      </LabelInputContainer>

      {/* Timeframe */}
      <LabelInputContainer>
        <Input name="timeframe" placeholder="Timeframe" defaultValue={state.values.timeframe} />
        <FieldError>{state.errors?.timeframe}</FieldError>
      </LabelInputContainer>

      {/* Indikator */}
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
          error={state.errors?.indicator}
        />
      </LabelInputContainer>

      {/* Catatan */}
      <LabelInputContainer>
        <Textarea
          name="notes"
          placeholder="Catatan tambahan"
          defaultValue={state.values.notes}
        />
        <FieldError>{state.errors?.notes}</FieldError>
      </LabelInputContainer>

      {/* Hidden checklist agar validasi tetap lolos */}
      <input type="hidden" name="checklist" value="dummy" />

      {/* Tombol Submit */}
      <div className="flex justify-end mt-10">
        <SubmitButton />
      </div>
    </form>
  );
}

// Reusable layout
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
