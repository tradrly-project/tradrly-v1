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

    // 2. Ambil 5 pair populer dari masing-masing type
    const selectedSymbols = [
      // Forex
      "EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCAD",
      // Crypto
      "BTCUSD", "ETHUSD", "SOLUSD", "XRPUSD", "ADAUSD",
      // Stock
      "AAPL", "MSFT", "TSLA", "AMZN", "GOOGL",
      // Index
      "US100", "US30", "SPX500", "DE40", "JP225",
    ];

    const selectedTimeframeNames = ["1D", "1h", "45m", "15m", "1m"];

    const [selectedPairs, indicators, timeframes, psychologies, strategies] = await Promise.all([
      prisma.pair.findMany({ where: { symbol: { in: selectedSymbols } } }),
      prisma.indicator.findMany(),
      prisma.timeframe.findMany({ where: { name: { in: selectedTimeframeNames } } }),
      prisma.psychology.findMany(),
      prisma.strategy.findMany(),
    ]);

    // 3. Buat relasi user ke data global
    await Promise.all([
      prisma.userPair.createMany({
        data: selectedPairs.map((pair) => ({
          userId: user.id,
          pairId: pair.id,
        })),
      }),
      prisma.userIndicator.createMany({
        data: indicators.map((indicator) => ({
          userId: user.id,
          indicatorId: indicator.id,
        })),
      }),
      prisma.userTimeframe.createMany({
        data: timeframes.map((tf) => ({
          userId: user.id,
          timeframeId: tf.id,
        })),
      }),
      prisma.userPsychology.createMany({
        data: psychologies.map((p) => ({
          userId: user.id,
          psychologyId: p.id,
        })),
      }),
      prisma.userStrategy.createMany({
        data: strategies.map((s) => ({
          userId: user.id,
          strategyId: s.id,
        })),
      }),
    ]);
  } catch (error) {
    console.error("❌ Sign up error:", error);
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
