// app/api/journal/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { TradeCreateSchema } from "@/lib/zod";

async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User tidak terautentikasi");
  }
  return session.user.id;
}

// ✅ GET Handler untuk fetch journals (untuk TanStack Query)
export async function GET() {
  try {
    const userId = await getUserId();

    const journals = await prisma.journal.findMany({
      where: { userId },
      include: {
        pair: {
          select: {
            id: true,
            customName: true,
            pair: {
              select: {
                symbol: true,
              },
            },
          },
        },
        setupTrade: { select: { id: true, name: true } },
        psychologies: { include: { psychology: true } },
        screenshots: true,
      },
      orderBy: { date: "desc" },
    });

    const pairs = await prisma.userPair.findMany({
      where: { userId },
      include: { pair: true },
      orderBy: { pair: { symbol: "asc" } },
    });

    const setupTrade = await prisma.setupTrade.findMany({
      where: { userId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });

    const allPsychologies = await prisma.psychology.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      journals,
      pairs: pairs.map((p) => ({ id: p.id, symbol: p.pair.symbol })),
      setupTrade,
      allPsychologies,
    }, {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=30, stale-while-revalidate=59",
      },
    });
  } catch (error) {
    console.error("GET /api/journal error:", error);
    return NextResponse.json(
      { error: "Gagal memuat data journal" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserId();
    const formData = await req.formData();
    const raw = Object.fromEntries(formData.entries());

    const psychologyIds = formData
      .getAll("psychologyIds")
      .map((val) => val.toString());

    const parsed = TradeCreateSchema.safeParse({
      ...raw,
      date: raw.date ? new Date(raw.date.toString()) : undefined,
      psychologyIds,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { psychologyIds: psyIds, screenshots, ...rest } = parsed.data;

    const trade = await prisma.journal.create({
      data: {
        ...rest,
        userId,
        psychologies: {
          connect: (psyIds ?? []).map((id: string) => ({ id })),
        },
        ...(screenshots?.length
          ? {
            screenshots: {
              create: screenshots.map((s) => ({
                url: s.url,
                type: s.type,
              })),
            },
          }
          : {}),
      },
    });

    revalidatePath("/dashboard"); // bisa arahkan ke halaman yang menggunakan journal

    return NextResponse.json(trade, {
      status: 201,
      headers: {
        "Cache-Control": "s-maxage=10, stale-while-revalidate=59",
      },
    });
  } catch (error) {
    console.error("POST trade error:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan trade" },
      { status: 500 }
    );
  }
}
