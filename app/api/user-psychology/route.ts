// app/api/user-psychology/route.ts

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

// GET semua userPsychology milik user
export async function GET() {
  try {
    const userId = await getUserId();

    const psychologies = await prisma.userPsychology.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        psychology: true, // Ambil detail dari global psychology
        journals: true, // Ambil jurnal-jurnal terkait
      },
    });

    return NextResponse.json(
      { psychologies },
      {
        headers: {
          "Cache-Control": "s-maxage=10, stale-while-revalidate=59",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/user-psychology error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil psikologi user" },
      { status: 500 }
    );
  }
}

// POST /api/user-psychology
export async function POST(req: Request) {
  try {
    const { psychologyId, customName } = await req.json();
    const userId = await getUserId();

    // Validasi: harus ada salah satu
    if (!psychologyId && !customName?.trim()) {
      return NextResponse.json(
        { error: "psychologyId atau customName harus diisi" },
        { status: 400 }
      );
    }

    // Cek duplikat
    if (psychologyId) {
      const existing = await prisma.userPsychology.findUnique({
        where: {
          userId_psychologyId: {
            userId,
            psychologyId,
          },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: "Psikologi ini sudah ditambahkan sebelumnya." },
          { status: 400 }
        );
      }
    }

    // Simpan entri baru di userPsychology
    const newUserPsychology = await prisma.userPsychology.create({
      data: {
        userId,
        psychologyId: psychologyId || null,
        customName: customName?.trim() || null,
      },
    });

    return NextResponse.json(newUserPsychology, { status: 201 });
  } catch (error) {
    console.error("POST /api/user-psychology error:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan psikologi ke user" },
      { status: 500 }
    );
  }
}



