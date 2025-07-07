// app/api/user-psychology/[id]/route.ts

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

// PATCH untuk update customName
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> } // ⬅️ gunakan Promise<{ id: string }>
) {
  try {
    const { id } = await context.params; // ⬅️ await params di sini
    const userId = await getUserId();
    const { customName } = await req.json();

    const updated = await prisma.userPsychology.updateMany({
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
        { error: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Berhasil diperbarui" });
  } catch (error) {
    console.error(`PATCH /api/user-psychology/[id] error:`, error);
    return NextResponse.json(
      { error: "Gagal memperbarui data" },
      { status: 500 }
    );
  }
}


// DELETE userPsychology
export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await prisma.userPsychology.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Berhasil dihapus" });
  } catch (error) {
    console.error("DELETE /api/user-psychology/[id] error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus psikologi" },
      { status: 500 }
    );
  }
}
