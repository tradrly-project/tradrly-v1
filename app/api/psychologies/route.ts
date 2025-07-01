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

    const userPsychologies = await prisma.userPsychology.findMany({
      where: {
        userId,
        hidden: false, // Optional: hanya yang aktif
      },
      include: {
        psychology: true, // join ke global Psychology
      },
      orderBy: {
        psychology: {
          name: "asc",
        },
      },
    })

    const psychologies = userPsychologies.map((up) => ({
      id: up.psychology.id,
      name: up.psychology.name,
    }))
    

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
