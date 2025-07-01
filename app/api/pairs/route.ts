import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// 🔐 Ambil user ID dari session
async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User tidak terautentikasi");
  }
  return session.user.id;
}

// ✅ GET: Ambil semua pairs aktif milik user dari UserPair
export async function GET() {
  try {
    const userId = await getUserId();

    const pairs = await prisma.userPair.findMany({
      where: {
        userId,
        isActive: true, // hanya tampilkan yang aktif
      },
      orderBy: { createdAt: "desc" },
      include: {
        pair: true, // ambil detail Pair global (symbol, etc.)
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
    console.error("Error fetching userPairs:", error);
    return NextResponse.json(
      { error: "Gagal mengambil pairs" },
      { status: 500 }
    );
  }
}

// ✅ POST: Tambah userPair berdasarkan Pair global
export async function POST(req: Request) {
  try {
    const { pairId, customName } = await req.json();
    const userId = await getUserId();

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
        { error: "Pair ini sudah ditambahkan." },
        { status: 400 }
      );
    }

    const newUserPair = await prisma.userPair.create({
      data: {
        userId,
        pairId,
        customName,
        isActive: true,
      },
    });

    revalidatePath("/api/pairs");

    return NextResponse.json({ pair: newUserPair });
  } catch (error) {
    console.error("Error creating userPair:", error);
    return NextResponse.json(
      { error: "Gagal menambah pair" },
      { status: 500 }
    );
  }
}

// ✅ DELETE: Soft delete UserPair (set isActive = false)
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json(); // ID dari userPair
    const userId = await getUserId();

    const updated = await prisma.userPair.updateMany({
      where: {
        id,
        userId,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    revalidatePath("/api/pairs");

    return NextResponse.json({ deletedCount: updated.count });
  } catch (error) {
    console.error("Error deleting userPair:", error);
    return NextResponse.json(
      { error: "Gagal menghapus pair" },
      { status: 500 }
    );
  }
}
