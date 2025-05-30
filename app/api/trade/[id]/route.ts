import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { TradeUpdateSchema } from "@/lib/zod"

async function getUserId() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("User tidak terautentikasi")
  }
  return session.user.id
}

// GET trade by ID
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const userId = await getUserId()
    const { id } = context.params

    const trade = await prisma.trade.findFirst({
      where: { id, userId },
    })

    if (!trade) {
      return NextResponse.json({ error: "Trade tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json(trade, {
      headers: {
        "Cache-Control": "s-maxage=10, stale-while-revalidate=59",
      },
    })
  } catch (error) {
    console.error("GET trade error:", error)
    return NextResponse.json({ error: "Gagal mengambil trade" }, { status: 500 })
  }
}

// UPDATE trade by ID
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const userId = await getUserId()
    const { id } = context.params
    const formData = await req.formData()
    const parsed = TradeUpdateSchema.safeParse(Object.fromEntries(formData.entries()))

    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const updated = await prisma.trade.updateMany({
      where: { id, userId },
      data: parsed.data,
    })

    revalidatePath("/api/trade")

    return NextResponse.json({ updatedCount: updated.count })
  } catch (error) {
    console.error("PUT trade error:", error)
    return NextResponse.json({ error: "Gagal mengupdate trade" }, { status: 500 })
  }
}

// DELETE trade by ID
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const userId = await getUserId()
    const { id } = context.params

    const deleted = await prisma.trade.deleteMany({
      where: { id, userId },
    })

    revalidatePath("/api/trade")

    return NextResponse.json({ deletedCount: deleted.count })
  } catch (error) {
    console.error("DELETE trade error:", error)
    return NextResponse.json({ error: "Gagal menghapus trade" }, { status: 500 })
  }
}
