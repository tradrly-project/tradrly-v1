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

  if (!userId) {
    return {
      message: "Unauthorized",
      values: {},
    };
  }

  const raw = Object.fromEntries(formData.entries());

  const values: TradeFormValues = {
    pairId: raw.pairId?.toString(),
    direction: raw.direction?.toString(),
    entryPrice: raw.entryPrice?.toString(),
    stoploss: raw.stoploss?.toString(),
    exitPrice: raw.exitPrice?.toString(),
    takeProfit: raw.takeProfit?.toString(),
    lotSize: raw.lotSize?.toString(),
    result: raw.result?.toString(),
    riskRatio: raw.riskRatio?.toString(),
    profitLoss: raw.profitLoss?.toString(),
    psychology: formData.getAll("psychology") as string[],
    setupTradeId: raw.setupTradeId?.toString(),
    notes: raw.notes?.toString(),
    screenshotUrl: raw.screenshotUrl?.toString(),
    date: raw.date?.toString(),
  };

  const angkaFields = [
    values.entryPrice,
    values.takeProfit,
    values.stoploss,
    values.exitPrice,
    values.lotSize,
  ];

  const angkaDiisi = angkaFields.some((val) => val && val.trim() !== "");

  if (angkaDiisi && (!values.direction || !values.pairId)) {
    return {
      errors: {
        direction: !values.direction ? ["Posisi wajib diisi terlebih dahulu."] : undefined,
        pairId: !values.pairId ? ["Pair wajib diisi terlebih dahulu."] : undefined,
      },
      message: "Lengkapi Pair/Posisi terlebih dahulu.",
      values,
    };
  }

  const parsedValues = {
    userId,
    pairId: values.pairId,
    direction: values.direction,
    entryPrice: values.entryPrice ? Number(values.entryPrice) : undefined,
    stoploss: values.stoploss ? Number(values.stoploss) : undefined,
    exitPrice: values.exitPrice ? Number(values.exitPrice) : undefined,
    takeProfit: values.takeProfit ? Number(values.takeProfit) : undefined,
    lotSize: values.lotSize ? Number(values.lotSize) : undefined,
    result: values.result,
    riskRatio: values.riskRatio ? Number(values.riskRatio) : undefined,
    profitLoss: values.profitLoss ? Number(values.profitLoss) : undefined,
    psychology: values.psychology || undefined,
    setupTradeId: values.setupTradeId || undefined,
    notes: values.notes || undefined,
    screenshotUrl: values.screenshotUrl || undefined,
    date: values.date ? new Date(values.date) : undefined,
  };

  const validated = TradeCreateSchema.safeParse(parsedValues);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Validasi gagal",
      values,
    };
  }

  try {
    const {
      psychology,
      setupTradeId,
      ...tradeData
    } = validated.data;

    await prisma.trade.create({
      data: {
        ...tradeData,
        psychologies: psychology?.length
          ? { connect: psychology.map((id) => ({ id })) }
          : undefined,
        setupTradeId: setupTradeId || undefined,
      },
    });

    revalidatePath("/dashboard/journal");

    return {
      message: "Trade berhasil disimpan",
      values: {},
    };
  } catch (error) {
    console.error("CREATE_TRADE_ERROR:", error);
    return {
      message: "Gagal menyimpan trade",
      values,
    };
  }
}
