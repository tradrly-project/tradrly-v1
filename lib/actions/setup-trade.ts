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

  const values: SetupTradeFormValues = {
    name: raw.name?.toString() ?? "",
    strategy: raw.strategy?.toString() ?? "",
    timeframe: raw.timeframe?.toString() ?? "",
    indicator: indicators,
    notes: raw.notes?.toString() || undefined,
  };

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
    const { indicator, ...rest } = validated.data;

    if (indicator && indicator.length > 0) {
      const indicatorsInDB = await prisma.indicator.findMany({
        where: {
          id: { in: indicator },
        },
        select: { id: true },
      });

      const foundIds = indicatorsInDB.map((i) => i.id);
      if (foundIds.length !== indicator.length) {
        return {
          message: "Beberapa indikator tidak ditemukan di database.",
          values,
        };
      }
    }

    await prisma.setupTrade.create({
      data: {
        ...rest,
        userId,
        ...(indicator && indicator.length > 0
          ? {
              indicators: {
                connect: indicator.map((id) => ({ id })),
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
