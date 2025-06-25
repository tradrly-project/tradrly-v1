// app/dashboard/journal/page.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import JournalClient from "@/app/dashboard/journal/journal-client";
import { TradeWithPair } from "@/lib/types";

function serializeDecimals<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "object" &&
      value !== null &&
      value.constructor?.name === "Decimal"
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

  // ✅ Ambil semua trade milik user
  const tradesRaw: TradeWithPair[] = await prisma.trade.findMany({
    where: { userId },
    include: {
      pair: true,
      setupTrade: {
        select: {
          id: true,
          name: true,
        },
      },
      psychologies: true,
    },
    orderBy: { date: "desc" },
  });

  // ✅ Ambil semua pair
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

  // ✅ Ambil semua setupTrade
  const setupTrade = await prisma.setupTrade.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  // ✅ Ambil semua opsi psychology (misalnya dari master table Psychology)
  const allPsychologies = await prisma.psychology.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const trades = serializeDecimals(tradesRaw);

  return (
    <JournalClient
      trades={trades}
      pairs={pairs}
      setupTrade={setupTrade}
      allPsychologies={allPsychologies} // ✅ Tidak error lagi
    />
  );
}
