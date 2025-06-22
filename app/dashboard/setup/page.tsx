// app/dashboard/setup/page.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import SetupClient from "./setup-client";

export default async function SetupTradePage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User tidak terautentikasi");
  }

  const setups = await prisma.setupTrade.findMany({
    where: { userId },
    include: {
      indicator: true, // Ganti dari setupPairs ke Indicator
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
      userId: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return <SetupClient setups={setups} indicators={indicators} />;
}
