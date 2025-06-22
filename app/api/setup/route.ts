import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { SetupTradeSchema } from "@/lib/zod";

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
    const parsed = SetupTradeSchema.safeParse(Object.fromEntries(formData.entries()));

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
        timeframe: parsed.data.timeframe,
        notes: parsed.data.notes,
        userId,
        indicatorId: parsed.data.indicator,
      },
      include: {
        indicator: true,
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

    const setups = await prisma.setupTrade.findMany({
      where: { userId },
      include: {
        indicator: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(setups, {
      headers: {
        "Cache-Control": "s-maxage=10, stale-while-revalidate=59",
      },
    });
  } catch (error) {
    console.error("GET setup error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data setup" },
      { status: 500 }
    );
  }
}
