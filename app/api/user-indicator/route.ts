// app/api/user-indicator/route.ts

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

// GET semua indikator milik user
export async function GET() {
  try {
    const userId = await getUserId();

    const userIndicators = await prisma.userIndicator.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        indicator: true,
        setups: true,
      },
    });

    return NextResponse.json(
      { indicators: userIndicators },
      {
        headers: {
          "Cache-Control": "s-maxage=10, stale-while-revalidate=59",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/user-indicator error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil indikator user" },
      { status: 500 }
    );
  }
}

// POST /api/user-indicator
export async function POST(req: Request) {
  try {
    const { indicatorId, customCode, customName } = await req.json();
    const userId = await getUserId();

    // CASE 1: Global indicator
    if (indicatorId) {
      const existing = await prisma.userIndicator.findUnique({
        where: {
          userId_indicatorId: {
            userId,
            indicatorId,
          },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: "Indikator ini sudah ditambahkan sebelumnya." },
          { status: 400 }
        );
      }

      const newUserIndicator = await prisma.userIndicator.create({
        data: {
          userId,
          indicatorId,
        },
      });
      return NextResponse.json(newUserIndicator, { status: 201 });
    }

    // CASE 2: Custom indicator
    // CASE 2: Custom indicator
    if (customCode && customName) {
      const normalizedCode = customCode.trim().toLowerCase();
      const normalizedName = customName.trim().toLowerCase();

      // Cek apakah nama/kode sudah digunakan di indikator global
      const existsInGlobal = await prisma.indicator.findFirst({
        where: {
          OR: [
            { name: { equals: normalizedName, mode: "insensitive" } },
            { code: { equals: normalizedCode, mode: "insensitive" } },
          ],
        },
      });

      if (existsInGlobal) {
        return NextResponse.json(
          {
            error:
              "Nama atau kode indikator sudah digunakan oleh indikator global.",
          },
          { status: 400 }
        );
      }

      // Cek apakah nama/kode sudah digunakan di indikator custom user mana pun
      const existsInCustom = await prisma.userIndicator.findFirst({
        where: {
          OR: [
            { customName: { equals: normalizedName, mode: "insensitive" } },
            { customCode: { equals: normalizedCode, mode: "insensitive" } },
          ],
        },
      });

      if (existsInCustom) {
        return NextResponse.json(
          { error: "Nama atau kode indikator sudah digunakan." },
          { status: 400 }
        );
      }

      const newUserIndicator = await prisma.userIndicator.create({
        data: {
          userId,
          customCode: customCode.trim(),
          customName: customName.trim(),
        },
      });

      return NextResponse.json(newUserIndicator, { status: 201 });
    }

    return NextResponse.json(
      {
        error:
          "Data tidak lengkap. Berikan indicatorId atau customCode + customName.",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("POST /api/user-indicator error:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan indikator ke user" },
      { status: 500 }
    );
  }
}
