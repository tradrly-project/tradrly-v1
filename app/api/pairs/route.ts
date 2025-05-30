import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Fungsi bantu untuk ambil user ID
async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User tidak terautentikasi");
  }
  return session.user.id;
}

// ✅ GET: Ambil semua pairs milik user
export async function GET() {
  try {
    const userId = await getUserId();

    const pairs = await prisma.pair.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        symbol: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ pairs }, {
      headers: {
        "Cache-Control": "s-maxage=10, stale-while-revalidate=59",
      },
    });
  } catch (error) {
    console.error("Error fetching pairs:", error);
    return NextResponse.json({ error: "Gagal mengambil pairs" }, { status: 500 });
  }
}

// ✅ POST: Tambah pair baru
export async function POST(req: Request) {
  try {
    const { symbol } = await req.json();
    const userId = await getUserId();

    const newPair = await prisma.pair.create({
      data: {
        symbol,
        userId,
      },
    });

    revalidatePath("/api/pairs");

    return NextResponse.json({ pair: newPair });
  } catch (error) {
    console.error("Error creating pair:", error);
    return NextResponse.json({ error: "Gagal menambah pair" }, { status: 500 });
  }
}

// ✅ DELETE: Hapus pair berdasarkan ID (dikirim via JSON)
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const userId = await getUserId();

    const deleted = await prisma.pair.deleteMany({
      where: {
        id,
        userId, // hanya boleh hapus pair milik sendiri
      },
    });

    revalidatePath("/api/pairs");

    return NextResponse.json({ deletedCount: deleted.count });
  } catch (error) {
    console.error("Error deleting pair:", error);
    return NextResponse.json({ error: "Gagal menghapus pair" }, { status: 500 });
  }
}
