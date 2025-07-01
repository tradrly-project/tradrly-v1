import { prisma } from "@/lib/prisma";
import { defaultPairs } from "@/lib/default/pairs";
import { defaultIndicators } from "@/lib/default/indicator";
import { defaultTimeframes } from "@/lib/default/timeframe";

async function main() {
  console.log("🌱 Mulai seeding data global...");

  // 1. Seed Pair
  await prisma.pair.createMany({
    data: defaultPairs.map((pair) => ({ symbol: pair.symbol })),
    skipDuplicates: true,
  });
  console.log("✅ Selesai seeding pairs");

  // 2. Seed Indicator
  await prisma.indicator.createMany({
    data: defaultIndicators.map((indicator) => ({
      code: indicator.code,
      name: indicator.name,
    })),
    skipDuplicates: true,
  });
  console.log("✅ Selesai seeding indicators");

  // 3. Seed Timeframe
  await prisma.timeframe.createMany({
    data: defaultTimeframes.map((tf) => ({ code: tf.code })),
    skipDuplicates: true,
  });
  console.log("✅ Selesai seeding timeframes");
}

main()
  .catch((err) => {
    console.error("❌ Gagal seeding:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
