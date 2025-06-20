// app/dashboard/journal/page.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import JournalClient from "@/app/dashboard/journal/journal-client";
import { TradeWithPair } from "@/lib/types";

function serializeDecimals<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "object" && value !== null && value.constructor?.name === "Decimal"
        ? Number(value)
        : value
    )
  );
}

export default async function JournalPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User tidak terautentikasi");
  }

  const tradesRaw: TradeWithPair[] = await prisma.trade.findMany({
    where: { userId },
    include: {
      pair: true,
    },
    orderBy: { date: "desc" },
  });

  const pairs = await prisma.pair.findMany({
    where: { userId },
    select: {
      id: true,
      symbol: true,
    },
    orderBy: {
      symbol: "asc",
    },
  });

  const setupTrades = await prisma.setupTrade.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const trades = serializeDecimals(tradesRaw); // ✅ konversi semua Decimal

  return <JournalClient trades={trades} pairs={pairs} setupTrades={setupTrades} />;
}
