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

// PATCH: Update customCode
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const userId = await getUserId();
    const { customCode } = await req.json();

    const updated = await prisma.userIndicator.updateMany({
      where: {
        id,
        userId,
      },
      data: {
        customCode,
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
    console.error("PATCH /api/user-indicator/[id] error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui indikator" },
      { status: 500 }
    );
  }
}

// DELETE: Hapus userIndicator berdasarkan ID
export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await prisma.userIndicator.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Berhasil dihapus" });
  } catch (error) {
    console.error("DELETE /api/user-indicator/[id] error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus indikator" },
      { status: 500 }
    );
  }
}
