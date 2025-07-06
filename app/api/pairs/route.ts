// app/api/pairs/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const pairs = await prisma.pair.findMany({
      orderBy: { symbol: "asc" },
    });

    return NextResponse.json(
      { pairs },
      {
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=59",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/pairs error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil pairs global" },
      { status: 500 }
    );
  }
}
