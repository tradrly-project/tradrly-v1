// app/api/user-timeframe/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// Ambil userId dari session
async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User tidak terautentikasi");
  }
  return session.user.id;
}

// GET semua timeframe milik user
export async function GET() {
  try {
    const userId = await getUserId();

    const timeframes = await prisma.userTimeframe.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        timeframe: true,
        setupTrades: true, // Ambil detail global timeframe
      },
    });

    return NextResponse.json(
      { timeframes },
      {
        headers: {
          "Cache-Control": "s-maxage=10, stale-while-revalidate=59",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/user-timeframe error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil timeframe user" },
      { status: 500 }
    );
  }
}

// POST /api/user-timeframe
export async function POST(req: Request) {
  try {
    const { timeframeId } = await req.json();
    const userId = await getUserId();

    if (!timeframeId) {
      return NextResponse.json(
        { error: "timeframeId harus diisi" },
        { status: 400 }
      );
    }

    // Cek duplikat
    const existing = await prisma.userTimeframe.findUnique({
      where: {
        userId_timeframeId: {
          userId,
          timeframeId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Timeframe ini sudah ditambahkan sebelumnya." },
        { status: 400 }
      );
    }

    // Simpan entri baru di userTimeframe
    const newUserTimeframe = await prisma.userTimeframe.create({
      data: {
        userId,
        timeframeId,
      },
    });

    return NextResponse.json(newUserTimeframe, { status: 201 });
  } catch (error) {
    console.error("POST /api/user-timeframe error:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan timeframe ke user" },
      { status: 500 }
    );
  }
}
