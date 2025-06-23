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

  const rawTimeframes = await prisma.timeframe.findMany({
    where: {
      OR: [
        { userId: null },
        { userId: userId },
      ],
    },
  });

  const timeframes = sortTimeframes(rawTimeframes);

  return <SetupClient setups={setups} indicators={indicators} timeframes={timeframes} />;
}
