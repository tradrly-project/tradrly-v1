"use server";

import { TradeCreateSchema } from "@/lib/zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import type { TradeFormState, TradeFormValues } from "@/lib/types";

// ✅ Fungsi untuk menghitung dan update winrate
async function updateSetupTradeWinrate(setupTradeId: string) {
  if (!setupTradeId) return;

  const trades = await prisma.trade.findMany({
    where: {
      setupTradeId,
    },
    select: {
      result: true,
    },
  });

  if (trades.length === 0) {
    await prisma.setupTrade.update({
      where: { id: setupTradeId },
      data: { winrate: 0 },
    });
    return;
  }

  const total = trades.length;
  const wins = trades.filter((t) => t.result === "win").length; // Pastikan enum "WIN"
  const winrate = (wins / total) * 100;

  await prisma.setupTrade.update({
    where: { id: setupTradeId },
    data: { winrate },
  });
}

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

  function getString(key: string) {
    return formData.get(key)?.toString() || undefined;
  }

  const screenshots: { type: "BEFORE" | "AFTER"; url: string }[] = [];

  for (let i = 0; ; i++) {
    const type = formData.get(`screenshots[${i}][type]`);
    const url = formData.get(`screenshots[${i}][url]`);
    if (!type || !url) break;

    screenshots.push({
      type: type.toString() as "BEFORE" | "AFTER",
      url: url.toString(),
    });
  }

  const values: TradeFormValues = {
    pairId: getString("pairId"),
    direction: getString("direction"),
    entryPrice: getString("entryPrice"),
    stoploss: getString("stoploss"),
    exitPrice: getString("exitPrice"),
    takeProfit: getString("takeProfit"),
    lotSize: getString("lotSize"),
    result: getString("result"),
    riskRatio: getString("riskRatio"),
    profitLoss: getString("profitLoss"),
    psychology: formData.getAll("psychology").map((p) => p.toString()),
    setupTradeId: getString("setupTradeId"),
    notes: getString("notes"),
    date: getString("date"),
    screenshots,
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
        direction: !values.direction
          ? ["Posisi wajib diisi terlebih dahulu."]
          : undefined,
        pairId: !values.pairId
          ? ["Pair wajib diisi terlebih dahulu."]
          : undefined,
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
    psychologyIds: values.psychology || undefined,
    setupTradeId: values.setupTradeId || undefined,
    notes: values.notes || undefined,
    screenshots: values.screenshots || [],
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
    const { psychologyIds, setupTradeId, screenshots, ...tradeData } =
      validated.data;

    const trade = await prisma.trade.create({
      data: {
        ...tradeData,
        psychologies: psychologyIds?.length
          ? { connect: psychologyIds.map((id) => ({ id })) }
          : undefined,
        setupTradeId: setupTradeId || undefined,
      },
    });

    // ✅ Tambahkan screenshots jika ada
    if (screenshots?.length) {
      await prisma.tradeScreenshot.createMany({
        data: screenshots.map((s) => ({
          tradeId: trade.id,
          type: s.type,
          url: s.url,
        })),
      });
    }

    // ✅ Update winrate jika ada setupTrade
    if (setupTradeId) {
      await updateSetupTradeWinrate(setupTradeId);
    }

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
