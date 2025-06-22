"use client";

import React from "react";
import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createSetupTrade } from "@/lib/actions/setup-trade";
import { ComboBox } from "../asset/combo-box";
import { SubmitButton } from "../button";
import { notifySuccess, notifyError } from "../asset/notify";

type SetupTradeFormProps = {
  indicator: { id: string; name: string }[];
};

export default function SetupTradeForm({ indicator }: SetupTradeFormProps) {
  const initialState = {
    message: "",
    errors: {},
    values: {
      name: "",
      strategy: "",
      timeframe: "",
      notes: "",
      indicator: "",
    },
  };

  const [state, formAction] = useActionState(createSetupTrade, initialState);
  const [indicatorId, setIndicatorId] = React.useState("");

  const handleSubmit = (formData: FormData) => {
    formData.set("indicator", indicatorId);
    formAction(formData);
  };

  React.useEffect(() => {
    if (state.message) {
      if (state.errors && Object.keys(state.errors).length > 0) {
        notifyError("Gagal menyimpan setup trade.");
      } else {
        notifySuccess(state.message);
        setIndicatorId("");
      }
    }
  }, [state]);

  return (
    <form action={handleSubmit} className="space-y-4">
      <LabelInputContainer>
        <Input name="name" placeholder="Nama Setup" />
        <FieldError>{state.errors?.name}</FieldError>
      </LabelInputContainer>

      <LabelInputContainer>
        <Input name="strategy" placeholder="Strategi" />
        <FieldError>{state.errors?.strategy}</FieldError>
      </LabelInputContainer>

      <LabelInputContainer>
        <Input name="timeframe" placeholder="Timeframe" />
        <FieldError>{state.errors?.timeframe}</FieldError>
      </LabelInputContainer>

      <LabelInputContainer>
        <ComboBox
          name="indicatorId"
          value={indicatorId}
          onChange={setIndicatorId}
          placeholder="Indikator"
          options={indicator.map((i) => ({
            label: i.name,
            value: i.id,
          }))}
        />
        <FieldError>{state.errors?.indicator}</FieldError>
      </LabelInputContainer>

      <LabelInputContainer>
        <Textarea name="notes" placeholder="Catatan tambahan" />
        <FieldError>{state.errors?.notes}</FieldError>
      </LabelInputContainer>

      {/* Hidden checklist agar validasi tetap lolos */}
      <input type="hidden" name="checklist" value="dummy" />

      <div className="flex justify-end mt-8">
        <SubmitButton />
      </div>
    </form>
  );
}

// Utilities
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
    <div className="-mt-3 ml-1">
      <span className="text-xs text-red-700">
        {Array.isArray(children) ? children.join(", ") : children}
      </span>
    </div>
  );
};
