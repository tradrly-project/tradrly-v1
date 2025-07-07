// app/api/psychology/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET semua psychology global
export async function GET() {
  try {
    const psychologies = await prisma.psychology.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(
      { psychologies },
      {
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=59",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/psychology error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil daftar psikologi global" },
      { status: 500 }
    );
  }
}
