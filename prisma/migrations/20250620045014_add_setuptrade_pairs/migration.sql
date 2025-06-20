-- DropForeignKey
ALTER TABLE "SetupTrade" DROP CONSTRAINT "SetupTrade_pairId_fkey";

-- DropIndex
DROP INDEX "SetupTrade_pairId_idx";

-- DropIndex
DROP INDEX "SetupTrade_userId_name_key";

-- CreateTable
CREATE TABLE "SetupTradePair" (
    "setupTradeId" TEXT NOT NULL,
    "pairId" TEXT NOT NULL,

    CONSTRAINT "SetupTradePair_pkey" PRIMARY KEY ("setupTradeId","pairId")
);

-- AddForeignKey
ALTER TABLE "SetupTradePair" ADD CONSTRAINT "SetupTradePair_setupTradeId_fkey" FOREIGN KEY ("setupTradeId") REFERENCES "SetupTrade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetupTradePair" ADD CONSTRAINT "SetupTradePair_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "Pair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
