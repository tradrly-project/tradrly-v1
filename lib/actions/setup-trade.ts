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
    indicator: raw.indicator?.toString() ?? "",
    notes: raw.notes?.toString() ?? undefined,
  };

  const validated = SetupTradeSchema.safeParse({
    ...values,
    userId,
    indicatorId: values.indicator,
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Validasi gagal",
      values,
    };
  }

  try {
    const { indicator, ...rest } = validated.data;

    await prisma.setupTrade.create({
      data: {
        ...rest,
        userId,
        indicatorId: indicator, // langsung assign ID-nya
      },
    });

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
