// app/api/user/change-password/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { compare, hash } from "bcrypt-ts";

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { oldPassword, newPassword } = await req.json();

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || !user.password) {
    return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
  }

  const match = await compare(oldPassword, user.password);
  if (!match) {
    return NextResponse.json({ error: "Password lama salah" }, { status: 400 });
  }

  const hashedNew = await hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNew },
  });

  return NextResponse.json({ message: "Password berhasil diubah" });
}
