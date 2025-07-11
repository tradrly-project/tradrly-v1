// app/api/user-timeframe/[id]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// Ambil userId
async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User tidak terautentikasi");
  }
  return session.user.id;
}

// PATCH: Update customCode atau hidden
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const userId = await getUserId();
    const { customName } = await req.json();

    const updated = await prisma.userTimeframe.updateMany({
      where: {
        id,
        userId,
      },
      data: {
        customName,
      },
    });

    if (updated.count === 0) {
      return NextResponse.json(
        { error: "Data tidak ditemukan atau bukan milik user" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Berhasil diperbarui" });
  } catch (error) {
    console.error("PATCH /api/user-timeframe/[id] error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui timeframe" },
      { status: 500 }
    );
  }
}

// DELETE: Hapus userTimeframe berdasarkan ID
export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await prisma.userTimeframe.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Berhasil dihapus" });
  } catch (error) {
    console.error("DELETE /api/user-timeframe/[id] error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus timeframe" },
      { status: 500 }
    );
  }
}
