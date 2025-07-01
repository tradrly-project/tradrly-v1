// app/api/user/update/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { UserUpdateSchema } from "@/lib/zod";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function PUT(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User tidak terautentikasi" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = UserUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, username, email, image } = parsed.data;

    // Cek email sudah dipakai user lain
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: userId },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah digunakan oleh pengguna lain." },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        username,
        email,
        image: image === "" ? null : image,
      },
    });

    // Revalidate halaman yang menampilkan data user
    revalidatePath("/");

    // Force refresh session cookie (untuk next-auth v5 + JWT mode)
    const sessionToken =
      (await cookies()).get("next-auth.session-token")?.value ||
      (await cookies()).get("__Secure-next-auth.session-token")?.value;

    if (sessionToken) {
      (await cookies()).set("next-auth.session-token", sessionToken, {
        path: "/",
        httpOnly: true,
      });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("PUT user error:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate user" },
      { status: 500 }
    );
  }
}
