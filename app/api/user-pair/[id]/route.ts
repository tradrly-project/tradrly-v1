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

// ✅ PUT: Update customName userPair
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> } // ⬅️ ini wajib async
) {
  try {
    const { id: userPairId } = await context.params; // ⬅️ ini wajib pakai await
    const userId = await getUserId();
    const { customName } = await request.json();

    const updated = await prisma.userPair.updateMany({
      where: {
        id: userPairId,
        userId,
      },
      data: {
        customName,
      },
    });

    if (updated.count === 0) {
      return NextResponse.json(
        { error: "Pair tidak ditemukan atau bukan milik user" },
        { status: 404 }
      );
    }

    return NextResponse.json({ updatedCount: updated.count });
  } catch (error) {
    console.error("PUT /api/user-pair/[id] error:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate pair user" },
      { status: 500 }
    );
  }
}

// ✅ DELETE: Hapus userPair by ID (hard delete)
export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const userId = (await auth())?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deleted = await prisma.userPair.deleteMany({
    where: {
      id,
      userId,
    },
  });

  if (deleted.count === 0) {
    return NextResponse.json(
      { error: "Pair tidak ditemukan atau bukan milik user" },
      { status: 404 }
    );
  }

  return NextResponse.json({ deletedCount: deleted.count });
}
