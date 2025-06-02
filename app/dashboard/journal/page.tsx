// app/dashboard/journal/page.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import JournalClient from "@/app/dashboard/journal/journal-client";
import { TradeWithPair } from "@/lib/types";  // digunakan untuk type safety

export default async function JournalPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User tidak terautentikasi");
  }

  const trades: TradeWithPair[] = await prisma.trade.findMany({
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

  return <JournalClient trades={trades} pairs={pairs} />; // ✅ jangan typo
}
