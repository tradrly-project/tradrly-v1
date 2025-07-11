import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { SetupTradeSchema } from "@/lib/zod";

async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User tidak terautentikasi");
  }
  return session.user.id;
}

// GET: Ambil SetupTrade berdasarkan ID
export async function GET(request: Request) {
  try {
    const userId = await getUserId();
    const id = request.url.split("/").pop();
    if (!id)
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });

    const setup = await prisma.setupTrade.findFirst({
      where: { id, userId },
      include: {
        indicators: true,
      },
    });

    if (!setup)
      return NextResponse.json(
        { error: "Setup tidak ditemukan" },
        { status: 404 }
      );

    return NextResponse.json(setup);
  } catch (error) {
    console.error("GET setup error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil setup" },
      { status: 500 }
    );
  }
}

// PUT: Update SetupTrade
export async function PUT(request: Request) {
  try {
    const userId = await getUserId();
    const id = request.url.split("/").pop();
    if (!id)
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });

    const json = await request.json();
    const parsed = SetupTradeSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    await prisma.setupTrade.update({
      where: { id, userId },
      data: {
        name: data.name,
        strategy: data.strategy,
        notes: data.notes,
        indicators: {
          set: data.indicatorIds?.map((id) => ({ id })),
        },
        timeframes: {
          set: data.timeframe?.map((id) => ({ id })),
        },
      },
    });

    revalidatePath("/api/setup");
    return NextResponse.json({ updated: true });
  } catch (error) {
    console.error("PUT setup error:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate setup" },
      { status: 500 }
    );
  }
}

// DELETE: Hapus SetupTrade
export async function DELETE(request: Request) {
  try {
    const userId = await getUserId();
    const id = request.url.split("/").pop();
    if (!id)
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });

    // Ambil data setup beserta journal-nya
    const existing = await prisma.setupTrade.findFirst({
      where: { id, userId },
      include: { journals: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Data tidak ditemukan atau tidak diizinkan" },
        { status: 403 }
      );
    }

    // Cek apakah masih ada journal terkait
    if (existing.journals.length > 0) {
      return NextResponse.json(
        {
          error:
            "Setup ini masih digunakan dalam jurnal dan tidak bisa dihapus.",
        },
        { status: 400 }
      );
    }

    await prisma.setupTrade.delete({ where: { id } });

    revalidatePath("/api/setup");
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("DELETE setup error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus setup" },
      { status: 500 }
    );
  }
}
