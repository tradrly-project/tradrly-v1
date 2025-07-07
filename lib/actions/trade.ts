"use server";

import { TradeCreateSchema } from "@/lib/zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import type { TradeFormState, TradeFormValues } from "@/lib/types";

// Fungsi untuk update winrate setup
async function updateSetupTradeWinrate(setupTradeId: string) {
  const trades = await prisma.journal.findMany({
    where: { setupTradeId },
    select: { result: true },
  });

  if (!trades.length) {
    await prisma.setupTrade.update({
      where: { id: setupTradeId },
      data: { winrate: 0 },
    });
    return;
  }

  const wins = trades.filter((t) => t.result === "win").length;
  const winrate = (wins / trades.length) * 100;

  await prisma.setupTrade.update({
    where: { id: setupTradeId },
    data: { winrate },
  });
}

// Fungsi utama untuk create journal trade
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

  // Cek pair & direction minimal jika ada angka
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

  // Validasi foreign key: pair, psychology, setupTrade
  const [pairValid, setupValid, validPsychologies] = await Promise.all([
    values.pairId
      ? prisma.userPair.findFirst({
          where: { id: values.pairId, userId },
          select: { id: true },
        })
      : null,
    values.setupTradeId
      ? prisma.setupTrade.findFirst({
          where: { id: values.setupTradeId, userId },
          select: { id: true },
        })
      : null,
    values.psychology?.length
      ? prisma.userPsychology.findMany({
          where: { id: { in: values.psychology }, userId },
          select: { id: true },
        })
      : [],
  ]);

  console.log("→ userId:", userId);
  console.log("→ values.psychology:", values.psychology);
  console.log("→ validPsychologies (from DB):", validPsychologies);

  if (values.pairId && !pairValid) {
    return {
      message: "Pair tidak ditemukan atau bukan milik user.",
      values,
    };
  }

  if (values.setupTradeId && !setupValid) {
    return {
      message: "Setup tidak ditemukan atau bukan milik user.",
      values,
    };
  }

  const uniquePsychologies = [...new Set(values.psychology)];
  if (validPsychologies.length !== uniquePsychologies.length) {
    return {
      message: "Beberapa psikologi tidak ditemukan atau bukan milik user.",
      values,
    };
  }

  // Parse angka dan tanggal
  const parsedValues = {
    userId,
    pairId: values.pairId,
    direction: values.direction,
    entryPrice: values.entryPrice ? Number(values.entryPrice) : null,
    stoploss: values.stoploss ? Number(values.stoploss) : null,
    exitPrice: values.exitPrice ? Number(values.exitPrice) : null,
    takeProfit: values.takeProfit ? Number(values.takeProfit) : null,
    lotSize: values.lotSize ? Number(values.lotSize) : null,
    result: values.result,
    riskRatio: values.riskRatio ? Number(values.riskRatio) : null,
    profitLoss: values.profitLoss ? Number(values.profitLoss) : null,
    setupTradeId: values.setupTradeId ?? null,
    notes: values.notes || null,
    screenshots: values.screenshots || [],
    date: values.date ? new Date(values.date) : new Date(),
    psychologyIds: validPsychologies.map((p) => p.id),
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

    const trade = await prisma.journal.create({
      data: {
        ...tradeData,
        setupTradeId: setupTradeId || undefined,
        psychologies: psychologyIds?.length
          ? {
              connect: psychologyIds.map((id) => ({ id })),
            }
          : undefined,
      },
    });

    if (screenshots?.length) {
      await prisma.tradeScreenshot.createMany({
        data: screenshots.map((s) => ({
          tradeId: trade.id,
          type: s.type,
          url: s.url,
        })),
      });
    }

    if (setupTradeId) {
      await updateSetupTradeWinrate(setupTradeId);
    }

    revalidatePath("/dashboard/journal");

    return {
      message: "Trade berhasil disimpan",
      values: {},
    };
  } catch (error) {
    console.error("CREATE_TRADE_ERROR:", JSON.stringify(error, null, 2));
    return {
      message: "Gagal menyimpan trade",
      values,
    };
  }
}
