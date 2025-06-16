import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { TradeCreateSchema } from "@/lib/zod"

async function getUserId() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("User tidak terautentikasi")
  }
  return session.user.id
}

export async function POST(req: Request) {
  try {
    const userId = await getUserId()
    const formData = await req.formData()
    const parsed = TradeCreateSchema.safeParse(Object.fromEntries(formData.entries()))

    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const trade = await prisma.trade.create({
      data: {
        ...parsed.data,
        userId,
      },
    })

    revalidatePath("/api/trade")

    return NextResponse.json(trade, {
      status: 201,
      headers: {
        "Cache-Control": "s-maxage=10, stale-while-revalidate=59",
      },
    })
  } catch (error) {
    console.error("POST trade error:", error)
    return NextResponse.json({ error: "Gagal menambahkan trade" }, { status: 500 })
  }
}
