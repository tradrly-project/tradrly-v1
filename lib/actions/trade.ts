"use server"

import { TradeCreateSchema } from "@/lib/zod"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function createTrade(prevState: unknown, formData: FormData) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return { message: "Unauthorized" }
  }

  const validated = TradeCreateSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Validasi gagal",
    }
  }

  try {
    await prisma.trade.create({
      data: {
        ...validated.data,
        userId,
      },
    })

    revalidatePath("/dashboard") // Sesuaikan path
    return { message: "Berhasil menambahkan trade" }

  } catch (error) {
    console.error(error)
    return { message: "Gagal menyimpan data" }
  }
}
