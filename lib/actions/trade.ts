"use server";

import { TradeCreateSchema } from "@/lib/zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import type { TradeFormState, TradeFormValues } from "@/lib/types";

export async function createTrade(
  prevState: TradeFormState,
  formData: FormData
): Promise<TradeFormState> {
  const session = await auth();
  const userId = session?.user?.id;

  // Ambil dan simpan semua nilai dari FormData
  const rawValues = Object.fromEntries(formData.entries());
  const values: TradeFormValues = {
    pairId: rawValues.pairId?.toString(),
    direction: rawValues.direction?.toString(),
    entryPrice: rawValues.entryPrice?.toString(),
    stoploss: rawValues.stoploss?.toString(),
    exitPrice: rawValues.exitPrice?.toString(),
    takeProfit: rawValues.takeProfit?.toString(),
    result: rawValues.result?.toString(),
    riskRatio: rawValues.riskRatio?.toString(),
    profitLoss: rawValues.profitLoss?.toString(),
    psychology: rawValues.psychology?.toString(),
    strategi: rawValues.strategi?.toString(),
    notes: rawValues.notes?.toString(),
    screenshotUrl: rawValues.screenshotUrl?.toString(),
    date: rawValues.date?.toString(),
  };

  if (!userId) {
    return {
      message: "Unauthorized",
      values,
    };
  }

  const validated = TradeCreateSchema.safeParse(values);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Validasi gagal",
      values,
    };
  }

  try {
    await prisma.trade.create({
      data: {
        ...validated.data,
        userId,
      },
    });

    revalidatePath("/dashboard/journal");

    return {
      message: "Berhasil menambahkan trade",
      values: {}, // Kosongkan values setelah berhasil submit
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Gagal menyimpan data",
      values,
    };
  }
}
