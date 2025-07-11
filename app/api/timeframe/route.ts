import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET semua timeframe global (dengan group)
export async function GET() {
  try {
    const timeframes = await prisma.timeframe.findMany({
      select: {
        id: true,
        name: true,
        group: true, // ambil enum group
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(
      { timeframes },
      {
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=59",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/timeframe error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil daftar timeframe global" },
      { status: 500 }
    );
  }
}
