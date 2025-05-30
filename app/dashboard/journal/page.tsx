// app/dashboard/journal/page.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import JournalClient from "./journal-client"; // ✅ WAJIB ADA
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
    orderBy: { closedAt: "desc" },
  });

  return <JournalClient trades={trades} />; // ✅ jangan typo
}
