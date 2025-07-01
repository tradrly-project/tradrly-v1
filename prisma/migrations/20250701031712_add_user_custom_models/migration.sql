/*
  Warnings:

  - You are about to drop the column `userId` on the `Indicator` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Pair` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Psychology` table. All the data in the column will be lost.
  - You are about to drop the `Trade` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PsychologyToTrade` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SetupTradeIndicators` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TimeframesOnSetupTrade` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[symbol]` on the table `Pair` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Psychology` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Indicator" DROP CONSTRAINT "Indicator_userId_fkey";

-- DropForeignKey
ALTER TABLE "Pair" DROP CONSTRAINT "Pair_userId_fkey";

-- DropForeignKey
ALTER TABLE "Psychology" DROP CONSTRAINT "Psychology_userId_fkey";

-- DropForeignKey
ALTER TABLE "Trade" DROP CONSTRAINT "Trade_pairId_fkey";

-- DropForeignKey
ALTER TABLE "Trade" DROP CONSTRAINT "Trade_setupTradeId_fkey";

-- DropForeignKey
ALTER TABLE "Trade" DROP CONSTRAINT "Trade_userId_fkey";

-- DropForeignKey
ALTER TABLE "TradeScreenshot" DROP CONSTRAINT "TradeScreenshot_tradeId_fkey";

-- DropForeignKey
ALTER TABLE "_PsychologyToTrade" DROP CONSTRAINT "_PsychologyToTrade_A_fkey";

-- DropForeignKey
ALTER TABLE "_PsychologyToTrade" DROP CONSTRAINT "_PsychologyToTrade_B_fkey";

-- DropForeignKey
ALTER TABLE "_SetupTradeIndicators" DROP CONSTRAINT "_SetupTradeIndicators_A_fkey";

-- DropForeignKey
ALTER TABLE "_SetupTradeIndicators" DROP CONSTRAINT "_SetupTradeIndicators_B_fkey";

-- DropForeignKey
ALTER TABLE "_TimeframesOnSetupTrade" DROP CONSTRAINT "_TimeframesOnSetupTrade_A_fkey";

-- DropForeignKey
ALTER TABLE "_TimeframesOnSetupTrade" DROP CONSTRAINT "_TimeframesOnSetupTrade_B_fkey";

-- DropIndex
DROP INDEX "Indicator_userId_idx";

-- DropIndex
DROP INDEX "Pair_symbol_userId_key";

-- DropIndex
DROP INDEX "Psychology_userId_idx";

-- AlterTable
ALTER TABLE "Indicator" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Pair" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Psychology" DROP COLUMN "userId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Trade";

-- DropTable
DROP TABLE "_PsychologyToTrade";

-- DropTable
DROP TABLE "_SetupTradeIndicators";

-- DropTable
DROP TABLE "_TimeframesOnSetupTrade";

-- CreateTable
CREATE TABLE "Journal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pairId" TEXT NOT NULL,
    "setupTradeId" TEXT,
    "direction" "TradeDirection" NOT NULL,
    "entryPrice" DECIMAL(65,30) NOT NULL,
    "stoploss" DECIMAL(65,30) NOT NULL,
    "takeProfit" DECIMAL(65,30) NOT NULL,
    "lotSize" DECIMAL(65,30) NOT NULL,
    "exitPrice" DECIMAL(65,30) NOT NULL,
    "result" "Result" NOT NULL,
    "profitLoss" DECIMAL(65,30) NOT NULL,
    "riskRatio" DECIMAL(65,30) NOT NULL,
    "notes" TEXT,
    "screenshotUrl" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Journal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPair" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pairId" TEXT NOT NULL,
    "customName" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPair_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPsychology" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "psychologyId" TEXT NOT NULL,
    "customName" TEXT,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPsychology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserIndicator" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "indicatorId" TEXT NOT NULL,
    "customCode" TEXT,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserIndicator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SetupTradeToUserIndicator" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SetupTradeToUserIndicator_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_SetupTradeToUserTimeframe" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SetupTradeToUserTimeframe_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_JournalToUserPsychology" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_JournalToUserPsychology_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Journal_userId_idx" ON "Journal"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPair_userId_pairId_key" ON "UserPair"("userId", "pairId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPsychology_userId_psychologyId_key" ON "UserPsychology"("userId", "psychologyId");

-- CreateIndex
CREATE UNIQUE INDEX "UserIndicator_userId_indicatorId_key" ON "UserIndicator"("userId", "indicatorId");

-- CreateIndex
CREATE INDEX "_SetupTradeToUserIndicator_B_index" ON "_SetupTradeToUserIndicator"("B");

-- CreateIndex
CREATE INDEX "_SetupTradeToUserTimeframe_B_index" ON "_SetupTradeToUserTimeframe"("B");

-- CreateIndex
CREATE INDEX "_JournalToUserPsychology_B_index" ON "_JournalToUserPsychology"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Pair_symbol_key" ON "Pair"("symbol");

-- AddForeignKey
ALTER TABLE "Journal" ADD CONSTRAINT "Journal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Journal" ADD CONSTRAINT "Journal_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "UserPair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Journal" ADD CONSTRAINT "Journal_setupTradeId_fkey" FOREIGN KEY ("setupTradeId") REFERENCES "SetupTrade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradeScreenshot" ADD CONSTRAINT "TradeScreenshot_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "Journal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPair" ADD CONSTRAINT "UserPair_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPair" ADD CONSTRAINT "UserPair_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "Pair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPsychology" ADD CONSTRAINT "UserPsychology_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPsychology" ADD CONSTRAINT "UserPsychology_psychologyId_fkey" FOREIGN KEY ("psychologyId") REFERENCES "Psychology"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserIndicator" ADD CONSTRAINT "UserIndicator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserIndicator" ADD CONSTRAINT "UserIndicator_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "Indicator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SetupTradeToUserIndicator" ADD CONSTRAINT "_SetupTradeToUserIndicator_A_fkey" FOREIGN KEY ("A") REFERENCES "SetupTrade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SetupTradeToUserIndicator" ADD CONSTRAINT "_SetupTradeToUserIndicator_B_fkey" FOREIGN KEY ("B") REFERENCES "UserIndicator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SetupTradeToUserTimeframe" ADD CONSTRAINT "_SetupTradeToUserTimeframe_A_fkey" FOREIGN KEY ("A") REFERENCES "SetupTrade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SetupTradeToUserTimeframe" ADD CONSTRAINT "_SetupTradeToUserTimeframe_B_fkey" FOREIGN KEY ("B") REFERENCES "UserTimeframe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JournalToUserPsychology" ADD CONSTRAINT "_JournalToUserPsychology_A_fkey" FOREIGN KEY ("A") REFERENCES "Journal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JournalToUserPsychology" ADD CONSTRAINT "_JournalToUserPsychology_B_fkey" FOREIGN KEY ("B") REFERENCES "UserPsychology"("id") ON DELETE CASCADE ON UPDATE CASCADE;
