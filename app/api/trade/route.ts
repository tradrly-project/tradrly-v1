import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { TradeCreateSchema } from "@/lib/zod";

async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User tidak terautentikasi");
  }
  return session.user.id;
}

export async function POST(req: Request) {
  try {
    const userId = await getUserId();
    const formData = await req.formData();
    const raw = Object.fromEntries(formData.entries());

    const psychologyIds = formData
      .getAll("psychologyIds")
      .map((val) => val.toString());

    const parsed = TradeCreateSchema.safeParse({
      ...raw,
      date: raw.date ? new Date(raw.date.toString()) : undefined,
      psychologyIds,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { psychologyIds: psyIds, screenshots, ...rest } = parsed.data;

    const trade = await prisma.trade.create({
      data: {
        ...rest,
        userId,
        psychologies: {
          connect: (psyIds ?? []).map((id: string) => ({ id })),
        },
        ...(screenshots?.length
          ? {
              screenshots: {
                create: screenshots.map((s) => ({
                  url: s.url,
                  type: s.type,
                })),
              },
            }
          : {}),
      },
    });

    revalidatePath("/api/trade");

    return NextResponse.json(trade, {
      status: 201,
      headers: {
        "Cache-Control": "s-maxage=10, stale-while-revalidate=59",
      },
    });
  } catch (error) {
    console.error("POST trade error:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan trade" },
      { status: 500 }
    );
  }
}
