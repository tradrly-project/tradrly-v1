import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET semua indikator global
export async function GET() {
  try {
    const indicators = await prisma.indicator.findMany({
      select: {
        id: true,
        name: true,
        code: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(
      { indicators },
      {
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=59",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/indicator error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil daftar indikator global" },
      { status: 500 }
    );
  }
}
