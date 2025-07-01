import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User tidak terautentikasi");
  }
  return session.user.id;
}

// ✅ GET: Ambil semua indikator milik user
export async function GET() {
  try {
    const userId = await getUserId();

    const userIndicators = await prisma.userIndicator.findMany({
      where: {
        userId,
        hidden: false,
      },
      include: {
        indicator: true,
      },
      orderBy: {
        indicator: {
          name: "asc",
        },
      },
    });

    const indicators = userIndicators.map((ui) => ({
      id: ui.id, // <- pakai id dari tabel userIndicator
      name: ui.indicator.name,
      code: ui.customCode || ui.indicator.code,
    }));
    
    
    return NextResponse.json({ indicators }, {
      headers: {
        "Cache-Control": "s-maxage=10, stale-while-revalidate=59",
      },
    });
  } catch (error) {
    console.error("Error fetching indicators:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data indikator" },
      { status: 500 }
    );
  }
}
