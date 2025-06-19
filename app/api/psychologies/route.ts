import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

async function getUserId() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("User tidak terautentikasi")
  }
  return session.user.id
}

// ✅ GET: Ambil semua psychologies milik user
export async function GET() {
  try {
    const userId = await getUserId()

    const psychologies = await prisma.psychology.findMany({
      where: { userId },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
      },
    })

    return NextResponse.json({ psychologies }, {
      headers: {
        "Cache-Control": "s-maxage=10, stale-while-revalidate=59",
      },
    })
  } catch (error) {
    console.error("Error fetching psychologies:", error)
    return NextResponse.json({ error: "Gagal mengambil data psikologi" }, { status: 500 })
  }
}
