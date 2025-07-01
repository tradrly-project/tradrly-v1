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

  const setupsRaw = await prisma.setupTrade.findMany({
    where: { userId },
    include: {
      indicators: {
        include: { indicator: true },
      },
      timeframes: {
        include: { timeframe: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const setups = setupsRaw.map((setup) => ({
    ...setup,
    indicators: setup.indicators.map((i) => ({
      id: i.indicator.id,
      name: i.indicator.name,
      code: i.customCode || i.indicator.code,
    })),
    timeframes: setup.timeframes.map((tf) => ({
      id: tf.timeframe.id,
      code: tf.customCode || tf.timeframe.code,
    })),
  }));

  const indicatorsRaw = await prisma.userIndicator.findMany({
    where: { userId },
    include: { indicator: true },
    orderBy: {
      indicator: { name: "asc" },
    },
  });

  const indicators = indicatorsRaw.map((ui) => ({
    id: ui.indicator.id,
    name: ui.indicator.name,
    code: ui.customCode || ui.indicator.code,
  }));

  const userTimeframes = await prisma.userTimeframe.findMany({
    where: { userId, hidden: false },
    include: { timeframe: true },
  });

  const rawTimeframes = userTimeframes.map((ut) => ({
    ...ut.timeframe,
    code: ut.customCode || ut.timeframe.code,
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
