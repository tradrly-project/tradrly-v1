"use server";

import { SigninSchema, RegisterSchema } from "@/lib/zod";
import { hashSync } from "bcrypt-ts";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const signUpCredentials = async (_prevState: unknown, formData: FormData) => {
  const validatedFields = RegisterSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, username, email, password } = validatedFields.data;
  const hashedPassword = hashSync(password, 10);

  try {
    // 1. Buat user baru
    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
      },
    });

    // 2. Ambil semua data global
    const [globalPairs, globalIndicators, globalTimeframes] = await Promise.all([
      prisma.pair.findMany(),
      prisma.indicator.findMany(),
      prisma.timeframe.findMany(),
    ]);

    // 3. Buat user bindings (tanpa membuat ulang data global)
    await Promise.all([
      prisma.userPair.createMany({
        data: globalPairs.map((p) => ({
          userId: user.id,
          pairId: p.id,
        })),
      }),
      prisma.userIndicator.createMany({
        data: globalIndicators.map((i) => ({
          userId: user.id,
          indicatorId: i.id,
        })),
      }),
      prisma.userTimeframe.createMany({
        data: globalTimeframes.map((tf) => ({
          userId: user.id,
          timeframeId: tf.id,
        })),
      }),
    ]);
  } catch (error) {
    console.error("Sign up error:", error);
    return {
      message: "Pendaftaran gagal. Email mungkin sudah terdaftar atau terjadi kesalahan.",
    };
  }
  redirect("/login");
};


// Login Credential

export const signInCredentials = async (
  _prevState: unknown,
  formData: FormData
) => {
  const validatedFields = SigninSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;
  const callbackUrl = formData.get("callbackUrl")?.toString() || "/dashboard";

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    // ✅ Tangkap error auth dari next-auth
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { message: "Email atau password salah." };
        default:
          return { message: "Akun belum terdaftar" };
      }
    }
    throw error;
  }
};
