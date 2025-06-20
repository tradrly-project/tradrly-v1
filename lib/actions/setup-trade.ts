"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { SetupTradeSchema } from "@/lib/zod";
import type { SetupTradeFormState, SetupTradeFormValues } from "@/lib/types";

export async function createSetupTrade(
    prevState: SetupTradeFormState,
    formData: FormData
): Promise<SetupTradeFormState> {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return {
            message: "Unauthorized",
            values: {} as SetupTradeFormValues,
        };
    }

    const raw = Object.fromEntries(formData.entries());

    const values: SetupTradeFormValues = {
        name: raw.name?.toString() ?? "",
        strategy: raw.strategy?.toString() ?? "",
        timeframe: raw.timeframe?.toString() ?? "",
        rrRatio: raw.rrRatio?.toString() ?? "",
        appliesToAllPairs: raw.appliesToAllPairs === "true",
        pairId: raw.pairId?.toString() ?? undefined,
        notes: raw.notes?.toString() ?? undefined,
        checklist: formData.getAll("checklist") as string[],
    };

    // Validasi menggunakan Zod
    const validated = SetupTradeSchema.safeParse({
        ...values,
        userId,
    });

    if (!validated.success) {
        return {
            errors: validated.error.flatten().fieldErrors,
            message: "Validasi gagal",
            values,
        };
    }

    try {
        const { checklist, pairId, appliesToAllPairs, ...rest } = validated.data;

        const newSetup = await prisma.setupTrade.create({
            data: {
                ...rest,
                userId,
                pairId: appliesToAllPairs ? null : pairId || null,

                checklistItems: {
                    create: checklist?.map((item, index) => ({
                        name: item,
                        order: index,
                    })),
                },
            },
        });


        // Jika pasangan pairId dipakai (tidak berlaku untuk semua), masukkan ke relasi pivot
        if (!appliesToAllPairs && pairId) {
            await prisma.setupTradePair.create({
                data: {
                    setupTradeId: newSetup.id,
                    pairId,
                },
            });
        }

        revalidatePath("/dashboard/setup");

        return {
            message: "Setup berhasil disimpan",
            values: {} as SetupTradeFormValues,
        };
    } catch (error) {
        console.error("❌ Error saat menyimpan SetupTrade:", error);
        return {
            message: "Gagal menyimpan setup",
            values,
        };
    }
}
