// app/api/user-pair/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// 🔐 Ambil user ID dari session
async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User tidak terautentikasi");
  }
  return session.user.id;
}

// ✅ GET: Ambil semua userPair milik user
export async function GET() {
  try {
    const userId = await getUserId();

    const pairs = await prisma.userPair.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        pair: true,
        journals: true, // ambil detail pair global
      },
    });

    return NextResponse.json(
      { pairs },
      {
        headers: {
          "Cache-Control": "s-maxage=10, stale-while-revalidate=59",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/user-pair error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil pairs user" },
      { status: 500 }
    );
  }
}

// POST /api/user-pair
export async function POST(req: Request) {
  try {
    const { pairId, customName, customType } = await req.json();
    const userId = await getUserId();

    // Validasi: minimal salah satu harus diisi
    if (!pairId && !customName?.trim()) {
      return NextResponse.json(
        { error: "pairId atau customName harus diisi" },
        { status: 400 }
      );
    }

    // Cek duplikat hanya jika pairId ada
    if (pairId) {
      const existing = await prisma.userPair.findUnique({
        where: {
          userId_pairId: {
            userId,
            pairId,
          },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: "Pair ini sudah ditambahkan sebelumnya." },
          { status: 400 }
        );
      }
    }

    // Simpan entri baru ke userPair
    const newUserPair = await prisma.userPair.create({
      data: {
        userId,
        pairId: pairId || null,
        customName: customName?.trim() || null,
        customType: pairId ? null : customType || null,
      },
    });

    return NextResponse.json(newUserPair, {
      status: 201,
    });
  } catch (error) {
    console.error("POST /api/user-pair error:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan pair ke user" },
      { status: 500 }
    );
  }
}

