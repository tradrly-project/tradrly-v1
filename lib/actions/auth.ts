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

export const signUpCredentials = async (_prevState: unknown, formData: FormData) => {
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

    /**
     * ================================================
     * 2. Handle Pairs: Global + UserPair Binding
     * ================================================
     */

    // a. Buat pair global jika belum ada (1x seumur hidup)
    for (const pair of defaultPairs) {
      await prisma.pair.upsert({
        where: { symbol: pair.symbol },
        update: {},
        create: { symbol: pair.symbol },
      });
    }

    // b. Ambil semua pair global
    const globalPairs = await prisma.pair.findMany({
      where: {
        symbol: { in: defaultPairs.map((p) => p.symbol) },
      },
    });

    // c. Buat UserPair (binding user ke pair global)
    await prisma.userPair.createMany({
      data: globalPairs.map((p) => ({
        userId: user.id,
        pairId: p.id,
      })),
    });

    /**
     * ================================================
     * 3. Handle Indicators: Global + UserIndicator Binding
     * ================================================
     */

    // a. Buat indikator global jika belum ada
    for (const indicator of defaultIndicators) {
      await prisma.indicator.upsert({
        where: { code: indicator.code },
        update: {},
        create: {
          name: indicator.name,
          code: indicator.code,
        },
      });
    }

    // b. Ambil semua indikator global
    const globalIndicators = await prisma.indicator.findMany({
      where: {
        code: { in: defaultIndicators.map((i) => i.code) },
      },
    });

    // c. Buat UserIndicator
    await prisma.userIndicator.createMany({
      data: globalIndicators.map((i) => ({
        userId: user.id,
        indicatorId: i.id,
      })),
    });

    /**
     * ================================================
     * 4. Handle Timeframes: Global + UserTimeframe Binding
     * ================================================
     */

    // a. Buat timeframe global jika belum ada
    for (const tf of defaultTimeframes) {
      await prisma.timeframe.upsert({
        where: { code: tf.code },
        update: {},
        create: { code: tf.code },
      });
    }

    // b. Ambil semua timeframe global
    const globalTimeframes = await prisma.timeframe.findMany();

    // c. Buat UserTimeframe
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
