import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { TradeUpdateSchema } from "@/lib/zod";
import { TradeWithPair } from "@/lib/types";

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
    const id = url.pathname.split("/").pop(); // Ambil [id] dari path

    if (!id) {
      return NextResponse.json(
        { error: "ID trade tidak valid" },
        { status: 400 }
      );
    }

    const trade: TradeWithPair | null = await prisma.trade.findFirst({
      where: { id, userId },
      include: {
        pair: true,
        setupTrade: {
          select: { name: true, id: true },
        },
        psychologies: true,
      },
    });

    if (!trade) {
      return NextResponse.json(
        { error: "Trade tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(trade, {
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
    console.log(userId)

    const json = await request.json();

    // ⬅️ UBAH MANUAL SEBELUM ZOD VALIDATION
    if (json.date && typeof json.date === "string") {
      json.date = new Date(json.date);
    }

    const parsed = TradeUpdateSchema.safeParse(json);
    console.log(parsed.data)
    console.log("Body received:", json);
    if (!parsed.success) {
      console.log("Validation error:", parsed.error);
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { psychologyIds, ...restData } = parsed.data;

    const updated = await prisma.trade.update({
      where: {
        id,
        userId,
      },
      data: {
        ...restData,
        ...(psychologyIds && {
          psychologies: {
            set: psychologyIds.map((id) => ({ id })),
          },
        }),
      },
    });

    // 🔁 Hitung ulang winrate setup setelah update trade
    if (restData.setupTradeId) {
      const relatedTrades = await prisma.trade.findMany({
        where: {
          setupTradeId: restData.setupTradeId,
          userId,
        },
        select: {
          result: true,
        },
      });

      const total = relatedTrades.length;
      const wins = relatedTrades.filter((t) => t.result === "win").length;
      const winrate = total > 0 ? (wins / total) * 100 : 0;

      await prisma.setupTrade.update({
        where: {
          id: restData.setupTradeId,
        },
        data: {
          winrate,
        },
      });
    }


    revalidatePath("/api/trade");

    return NextResponse.json({ updated });
  } catch (error) {
    console.error("PUT trade error:", error);
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

    // Ambil setupTradeId sebelum trade dihapus
    const existingTrade = await prisma.trade.findUnique({
      where: {
        id,
        userId,
      },
      select: {
        setupTradeId: true,
      },
    });

    if (!existingTrade) {
      return NextResponse.json(
        { error: "Trade tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hapus trade
    await prisma.trade.delete({
      where: {
        id,
        userId,
      },
    });

    // Hitung ulang winrate untuk setupTrade
    if (existingTrade.setupTradeId) {
      const relatedTrades = await prisma.trade.findMany({
        where: {
          setupTradeId: existingTrade.setupTradeId,
          userId,
        },
        select: {
          result: true,
        },
      });

      const total = relatedTrades.length;
      const wins = relatedTrades.filter((t) => t.result === "win").length;
      const winrate = total > 0 ? (wins / total) * 100 : 0;

      await prisma.setupTrade.update({
        where: {
          id: existingTrade.setupTradeId,
        },
        data: {
          winrate,
        },
      });
    }

    revalidatePath("/api/trade");

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("DELETE trade error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus trade" },
      { status: 500 }
    );
  }
}
