// app/lib/actions/setup-trade.ts

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

  const indicators = formData
    .getAll("indicator")
    .filter(Boolean)
    .map((val) => val.toString());

  const timeframes = formData
    .getAll("timeframe") // ✅ SAMA dengan hidden input
    .filter(Boolean)
    .map((val) => val.toString());
  

  const values: SetupTradeFormValues = {
    name: raw.name?.toString() ?? "",
    strategy: raw.strategy?.toString() ?? "",
    indicatorIds: indicators,
    timeframe: timeframes,
    notes: raw.notes?.toString() || undefined,
  };
  console.log("INDIKATOR DARI FORM:", indicators);

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
    const { indicatorIds, timeframe, ...rest } = validated.data;

    // Validasi indikator
    if (indicatorIds?.length) {
      const indicatorsInDB = await prisma.userIndicator.findMany({
        where: {
          id: { in: indicatorIds },
          userId,
        },
        select: { id: true },
      });
      console.log("INDIKATOR DITEMUKAN DI DB:", indicatorsInDB.map(i => i.id));
      
      const foundIds = indicatorsInDB.map((i) => i.id);
      if (foundIds.length !== indicatorIds.length) {
        return {
          message: "Beberapa indikator tidak ditemukan atau bukan milik user.",
          values,
        };
      }
    }

    // Validasi timeframe
    if (timeframe?.length) {
      const tfInDB = await prisma.userTimeframe.findMany({
        where: {
          id: { in: timeframes },
          userId,
        },
        select: { id: true },
      });
      const foundTFs = tfInDB.map((t) => t.id);
      if (foundTFs.length !== timeframes.length) {
        return {
          message: "Beberapa timeframe tidak ditemukan atau bukan milik user.",
          values,
        };
      }
    }

    // Simpan setup
    await prisma.setupTrade.create({
      data: {
        ...rest,
        userId,
        ...(indicatorIds?.length
          ? {
            indicators: {
              connect: indicatorIds.map((id) => ({ id })), // dari UserIndicator
            },
          }
          : {}),
        ...(timeframes?.length
          ? {
            timeframes: {
              connect: timeframes.map((id) => ({ id })), // dari UserTimeframe
            },
          }
          : {}),
      },
    });

    revalidatePath("/dashboard/setup");

    return {
      message: "Setup berhasil disimpan",
      values: {} as SetupTradeFormValues,
    };
  } catch (error) {
    console.error("createSetupTrade error:", error);
    return {
      message: "Gagal menyimpan setup",
      values,
    };
  }
}
