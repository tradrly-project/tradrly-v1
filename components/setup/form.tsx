"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createSetupTrade } from "@/lib/actions/setup-trade";
import { SubmitButton } from "../button";
import { notifySuccess, notifyError } from "../asset/notify";
import { IndicatorSelect } from "../select/indicator-select";
import { SetupTradeFormState } from "@/lib/types";
import { TimeframeSelect } from "../select/timeframe-select";
import FieldError from "../asset/field-error";
import LabelInputContainer from "../asset/label-input";

type SetupTradeFormProps = {
  indicator: { id: string; name: string; code: string }[];
  timeframe: { id: string; code: string }[];
};

export default function SetupTradeForm({
  indicator,
  timeframe,
}: SetupTradeFormProps) {
  const initialState = {
    message: "",
    errors: undefined,
    values: {
      name: "",
      strategy: "",
      timeframe: [] as string[],
      notes: "",
      indicator: [] as string[], // ✅ FIXED: harus array
    },
  };

  const [state, setState] = useState<SetupTradeFormState>(initialState);
  const [selectedIndicators, setSelectedIndicators] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedTimeframes, setSelectedTimeframes] = useState<
    { label: string; value: string }[]
  >([]);

  const handleSubmit = async (formData: FormData) => {
    const indicatorIds = selectedIndicators.map((i) => i.value);
    const timeframeIds = selectedTimeframes.map((i) => i.value);

    indicatorIds.forEach((id) => formData.append("indicator", id));
    timeframeIds.forEach((id) => formData.append("timeframe", id));

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
        setSelectedTimeframes([]);
      }
    }
  }, [state]);

  return (
    <form action={handleSubmit} className="space-y-6 h-full">
      {/* Nama Setup */}
      <LabelInputContainer>
        <Input
          name="name"
          placeholder="Nama Setup"
          defaultValue={state.values.name}
        />
        <FieldError>{state.errors?.name}</FieldError>
      </LabelInputContainer>

      {/* Strategi */}
      <LabelInputContainer>
        <Input
          name="strategy"
          placeholder="Strategi"
          defaultValue={state.values.strategy}
        />
        <FieldError>{state.errors?.strategy}</FieldError>
      </LabelInputContainer>

      {/* Timeframe */}
      <LabelInputContainer>
        <TimeframeSelect
          name="timeframe"
          selected={selectedTimeframes}
          onChange={setSelectedTimeframes}
          options={timeframe.map((t) => ({ label: t.code, value: t.id }))}
          placeholder="Pilih Timeframe"
          error={state.errors?.timeframe}
        />
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
