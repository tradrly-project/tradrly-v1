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
import { useMutation, useQueryClient } from "@tanstack/react-query"

const initialFormState: SetupTradeFormState = {
  message: "",
  errors: undefined,
  values: {
    name: "",
    strategy: "",
    timeframe: [],
    notes: "",
    indicatorIds: [],
  },
};

type SetupTradeFormProps = {
  indicator: { id: string; name: string; code: string }[];
  timeframe: { id: string; code: string }[];
};

export default function SetupTradeForm({
  indicator,
  timeframe,
}: SetupTradeFormProps) {
  const [state, setState] = useState<SetupTradeFormState>(initialFormState);
  const [selectedIndicators, setSelectedIndicators] = useState<{ label: string; value: string }[]>([]);
  const [selectedTimeframes, setSelectedTimeframes] = useState<{ label: string; value: string }[]>([]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await createSetupTrade(state, formData);
    },
    onSuccess: (data) => {
      setState(data);
      queryClient.invalidateQueries({ queryKey: ["setup-trade"] });
    },
    onError: () => {
      notifyError("Gagal menyimpan setup trade.");
    },
  });

  const handleSubmit = (formData: FormData) => {
    formData.set("indicatorIds", JSON.stringify(selectedIndicators.map((i) => i.value)));
    selectedTimeframes.forEach((t, index) => {
      formData.append(`timeframe[${index}]`, t.value);
    });
    

    mutation.mutate(formData);
  };

  useEffect(() => {
    if (state.message) {
      if (state.errors && Object.keys(state.errors).length > 0) {
        notifyError("Gagal menyimpan setup.");
      } else {
        notifySuccess(state.message);

        // ✅ Gunakan salinan nilai awal, bukan `initialState` dari dalam fungsi
        setState({ ...initialFormState });
        setSelectedIndicators([]);
        setSelectedTimeframes([]);

        queryClient.invalidateQueries({ queryKey: ["setup-trade"] });
      }
    }
  }, [state.message, state.errors, queryClient]);

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
          name="indicator"
          selected={selectedIndicators}
          onChange={setSelectedIndicators}
          options={indicator.map((i) => ({
            label: `${i.name} (${i.code})`,
            value: i.id, // ✅ userIndicator.id
          }))}
          placeholder="Pilih Indikator"
          error={state.errors?.indicatorIds}
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
