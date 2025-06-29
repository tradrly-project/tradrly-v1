// app/dashboard/setup/page.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import SetupClient from "./setup-client";
import { sortTimeframes } from "@/lib/default/timeframe";

export default async function SetupTradePage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User tidak terautentikasi");
  }

  const setups = await prisma.setupTrade.findMany({
    where: { userId },
    include: {
      indicators: true,
      timeframes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Ambil semua indikator user untuk opsi dropdown dsb
  const indicators = await prisma.indicator.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      code: true,
      userId: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const userTimeframes = await prisma.userTimeframe.findMany({
    where: {
      userId,
      hidden: false, // kalau kamu hanya ingin yang aktif saja
    },
    include: {
      timeframe: true,
    },
  });

  const rawTimeframes = userTimeframes.map((ut) => ({
    ...ut.timeframe,
    code: ut.customCode || ut.timeframe.code, // kalau user rename TF, pakai itu
  }));

  const timeframes = sortTimeframes(rawTimeframes);

  return (
    <SetupClient
      setups={setups}
      indicators={indicators}
      timeframes={timeframes}
    />
  );
}
