import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { TradeUpdateSchema } from "@/lib/zod";
import { TradeWithPair } from "@/lib/types";
import { Prisma, ScreenshotType } from "@prisma/client";

async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User tidak terautentikasi");
  }
  return session.user.id;
}

// GET trade by ID
export async function GET(request: Request) {
  try {
    const userId = await getUserId();
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { error: "ID trade tidak valid" },
        { status: 400 }
      );
    }

    const journal = await prisma.journal.findUnique({
      where: { id, userId },
      include: {
        pair: { include: { pair: true } },
        setupTrade: { select: { id: true, name: true } },
        psychologies: { include: { psychology: true } },
        screenshots: true,
      },
    });

    const mappedJournal: TradeWithPair | null = journal
      ? {
          ...journal,
          customName: journal.pair?.customName ?? null,
          customType: (["crypto", "forex", "stock", "index"].includes(
            journal.pair?.customType || ""
          )
            ? journal.pair?.customType
            : null) as "crypto" | "forex" | "stock" | "index" | null,
        }
      : null;

    if (!journal) {
      return NextResponse.json(
        { error: "Trade tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(mappedJournal, {
      headers: {
        "Cache-Control": "s-maxage=10, stale-while-revalidate=59",
      },
    });
  } catch (error) {
    console.error("GET trade error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil trade" },
      { status: 500 }
    );
  }
}

function sanitize<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null)
  ) as Partial<T>;
}

// PUT trade by ID
export async function PUT(request: Request) {
  try {
    const userId = await getUserId();
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { error: "ID trade tidak valid" },
        { status: 400 }
      );
    }

    const json = await request.json();

    // Parse tanggal string ke Date object jika perlu
    if (json.date && typeof json.date === "string") {
      json.date = new Date(json.date);
    }

    // Kosongkan string kosong jadi undefined
    if (json.setupTradeId === "") {
      json.setupTradeId = undefined;
    }

    const parsed = TradeUpdateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { psychologyIds, screenshots, setupTradeId, ...rest } = parsed.data;

    const updateData: Prisma.JournalUpdateInput = {
      ...sanitize(rest),
    };

    // ✅ Relasi multiple psychologies: ambil UserPsychology.id berdasarkan psychologyId dan userId
    if (psychologyIds && psychologyIds.length > 0) {
      updateData.psychologies = {
        set: psychologyIds.map((id) => ({ id })), // <- ini UserPsychology.id
      };
    } else {
      updateData.psychologies = { set: [] };
    }

    // 📸 Relasi screenshots
    if (screenshots) {
      updateData.screenshots = {
        deleteMany: {},
        create: screenshots.map((s) => ({
          type: s.type as ScreenshotType,
          url: s.url,
        })),
      };
    }

    // ⚙️ Relasi setupTrade
    if (setupTradeId !== undefined) {
      updateData.setupTrade = setupTradeId
        ? { connect: { id: setupTradeId } }
        : { disconnect: true };
    }

    // 📝 Update Journal
    const updated = await prisma.journal.update({
      where: {
        id,
        userId,
      },
      data: updateData,
    });

    // 🔁 Recalculate winrate jika ada setupTradeId
    if (setupTradeId) {
      const related = await prisma.journal.findMany({
        where: { setupTradeId, userId },
        select: { result: true },
      });

      const total = related.length;
      const win = related.filter((t) => t.result === "win").length;
      const winrate = total > 0 ? (win / total) * 100 : 0;

      await prisma.setupTrade.update({
        where: { id: setupTradeId },
        data: { winrate },
      });
    }

    revalidatePath("/api/journal");

    return NextResponse.json({ updated });
  } catch (error) {
    console.error("Trade PUT error:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate trade" },
      { status: 500 }
    );
  }
}

// DELETE trade by ID
export async function DELETE(request: Request) {
  try {
    const userId = await getUserId();
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { error: "ID trade tidak valid" },
        { status: 400 }
      );
    }

    const existingTrade = await prisma.journal.findUnique({
      where: { id, userId },
      select: { setupTradeId: true },
    });

    if (!existingTrade) {
      return NextResponse.json(
        { error: "Trade tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.journal.delete({
      where: { id, userId },
    });

    // Hitung ulang winrate
    if (existingTrade.setupTradeId) {
      const relatedTrades = await prisma.journal.findMany({
        where: { setupTradeId: existingTrade.setupTradeId, userId },
        select: { result: true },
      });

      const total = relatedTrades.length;
      const wins = relatedTrades.filter((t) => t.result === "win").length;
      const winrate = total > 0 ? (wins / total) * 100 : 0;

      await prisma.setupTrade.update({
        where: { id: existingTrade.setupTradeId },
        data: { winrate },
      });
    }

    revalidatePath("/api/journal");

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("DELETE trade error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus trade" },
      { status: 500 }
    );
  }
}
