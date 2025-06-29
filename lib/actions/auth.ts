"use server";

import { SigninSchema, RegisterSchema } from "@/lib/zod";
import { hashSync } from "bcrypt-ts";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { defaultPairs } from "@/lib/default/pairs";
import { defaultIndicators } from "../default/indicator";
import { defaultTimeframes } from "../default/timeframe";

export const signUpCredentials = async (
  _prevState: unknown,
  formData: FormData
) => {
  const validatedFields = RegisterSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

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

    // 2. Buat pairs default untuk user baru
    await prisma.pair.createMany({
      data: defaultPairs.map((pair) => ({
        symbol: pair.symbol,
        userId: user.id,
      })),
    });

    // 3. Buat indikator default untuk user baru
    await prisma.indicator.createMany({
      data: defaultIndicators.map((indicator) => ({
        name: indicator.name,
        code: indicator.code,
        userId: user.id,
      })),
    });

    // ✅ 4. Cek apakah Timeframe global sudah ada
    const existingTimeframes = await prisma.timeframe.findMany();
    if (existingTimeframes.length === 0) {
      await prisma.timeframe.createMany({
        data: defaultTimeframes.map((tf) => ({
          code: tf.code,
        })),
      });
    }

    // ✅ 5. Ambil semua Timeframe global dari DB
    const globalTimeframes = await prisma.timeframe.findMany();

    // ✅ 6. Kaitkan user baru ke semua timeframe global
    await prisma.userTimeframe.createMany({
      data: globalTimeframes.map((tf) => ({
        userId: user.id,
        timeframeId: tf.id,
      })),
    });
  } catch (error) {
    console.error("Sign up error:", error);
    return {
      message: "Pendaftaran Gagal! Akun sudah ada atau terjadi kesalahan.",
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

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
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
