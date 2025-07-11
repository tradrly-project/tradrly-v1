// app/api/setup/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { SetupTradeSchema } from "@/lib/zod";
import { sortTimeframes } from "@/lib/default/timeframe";

async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User tidak terautentikasi");
  }
  return session.user.id;
}

export async function POST(req: Request) {
  try {
    const userId = await getUserId();
    const formData = await req.formData();

    const parsed = SetupTradeSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const createdSetup = await prisma.setupTrade.create({
      data: {
        name: parsed.data.name,
        strategy: parsed.data.strategy,
        notes: parsed.data.notes,
        userId,
        indicators: {
          connect: parsed.data.indicatorIds?.map((id) => ({ id })) ?? [],
        },
        timeframes: {
          connect: parsed.data.timeframe?.map((id) => ({ id })) ?? [],
        },
      },
      include: {
        indicators: true,
      },
    });

    revalidatePath("/api/setup");

    return NextResponse.json(createdSetup, {
      status: 201,
      headers: {
        "Cache-Control": "s-maxage=10, stale-while-revalidate=59",
      },
    });
  } catch (error) {
    console.error("POST setup error:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan setup" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const userId = await getUserId();

    const setupsRaw = await prisma.setupTrade.findMany({
      where: { userId },
      include: {
        indicators: {
          include: { indicator: true },
        },
        timeframes: {
          include: { timeframe: true },
        },
        journals: { select: { id: true } },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const setups = setupsRaw.map((setup) => ({
      id: setup.id,
      name: setup.name,
      strategy: setup.strategy,
      notes: setup.notes,
      userId: setup.userId,
      createdAt: setup.createdAt,
      updatedAt: setup.updatedAt,
      winrate: setup.winrate, // ✅ ini yang menyebabkan error jika tidak ada

      indicators: setup.indicators.map((i) => ({
        id: i.indicator?.id,
        name: i.indicator?.name,
        code: i.customCode || i.indicator?.code,
      })),

      timeframes: setup.timeframes.map((tf) => ({
        id: tf.timeframe?.id ?? "", // fallback ke string kosong jika null
        name: (tf.customName || tf.timeframe?.name) ?? "",
      })),
    }));

    const indicatorsRaw = await prisma.userIndicator.findMany({
      where: { userId },
      include: { indicator: true },
      orderBy: {
        indicator: { name: "asc" },
      },
    });

    const indicators = indicatorsRaw.map((ui) => ({
      id: ui.id,
      name: ui.indicator?.name,
      code: ui.customCode || ui.indicator?.code,
    }));

    const userTimeframes = await prisma.userTimeframe.findMany({
      where: { userId },
      include: { timeframe: true },
    });

    const rawTimeframes = userTimeframes.map((ut) => ({
      id: ut.id,
      name: (ut.customName || ut.timeframe?.name) ?? "",
    }));

    const timeframes = sortTimeframes(rawTimeframes);

    return NextResponse.json(
      { setups, indicators, timeframes },
      {
        headers: {
          "Cache-Control": "s-maxage=10, stale-while-revalidate=59",
        },
      }
    );
  } catch (error) {
    console.error("GET setup error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data setup" },
      { status: 500 }
    );
  }
}
