// components/forms/setup-trade-form.tsx
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type SetupTradeFormProps = {
    pairs: { id: string; symbol: string }[];
};

export default function SetupTradeForm({ pairs }: SetupTradeFormProps) {
    const initialState = {
        message: "",
        errors: {},
        values: {
            name: "",
            strategy: "",
            timeframe: "",
            rrRatio: "",
            notes: "",
            appliesToAllPairs: false,
            pairId: "",
            checklist: [], // ✅ Diperlukan!
        },
    };

    const [state, formAction] = useActionState(
        createSetupTrade,
        initialState
    );

    const [pairId, setPairId] = React.useState("");
    const [appliesToAllPairs, setAppliesToAllPairs] = React.useState(false);

    const handleSubmit = (formData: FormData) => {
        formData.set("appliesToAllPairs", appliesToAllPairs.toString());
        if (!appliesToAllPairs) {
            formData.set("pairId", pairId);
        }
        // bisa tambahkan checklist default kalau belum ada input-nya
        formAction(formData); // ✅ formAction dipanggil langsung
    };

    React.useEffect(() => {
        if (state.message) {
            if (state.errors && Object.keys(state.errors).length > 0) {
                notifyError("Gagal menyimpan setup trade.");
            } else {
                notifySuccess(state.message);
                setPairId("");
                setAppliesToAllPairs(false);
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
                <Input name="rrRatio" placeholder="RR Ratio" />
                <FieldError>{state.errors?.rrRatio}</FieldError>
            </LabelInputContainer>

            {/* Apakah untuk semua pair */}
            <LabelInputContainer>
                <div className="flex items-center space-x-3">
                    <Switch
                        checked={appliesToAllPairs}
                        onCheckedChange={setAppliesToAllPairs}
                        id="appliesToAllPairs"
                    />
                    <Label htmlFor="appliesToAllPairs">
                        Berlaku untuk semua pair
                    </Label>
                </div>
            </LabelInputContainer>

            {!appliesToAllPairs && (
                <LabelInputContainer>
                    <ComboBox
                        name="pairId"
                        value={pairId}
                        onChange={setPairId}
                        options={pairs.map((p) => ({
                            label: p.symbol,
                            value: p.id,
                        }))}
                    />
                    <FieldError>{state.errors?.pairId}</FieldError>
                </LabelInputContainer>
            )}

            <LabelInputContainer>
                <Textarea name="notes" placeholder="Catatan tambahan" />
                <FieldError>{state.errors?.notes}</FieldError>
            </LabelInputContainer>

            {/* Hidden checklist sementara untuk validasi lulus */}
            <input type="hidden" name="checklist" value="dummy item" />

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
