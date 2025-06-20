/*
  Warnings:

  - You are about to drop the column `content` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the `_StrategyToTrade` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_StrategyToTrade" DROP CONSTRAINT "_StrategyToTrade_A_fkey";

-- DropForeignKey
ALTER TABLE "_StrategyToTrade" DROP CONSTRAINT "_StrategyToTrade_B_fkey";

-- DropIndex
DROP INDEX "Strategy_userId_name_key";

-- AlterTable
ALTER TABLE "Trade" DROP COLUMN "content",
DROP COLUMN "title",
ADD COLUMN     "setupTradeId" TEXT;

-- DropTable
DROP TABLE "_StrategyToTrade";

-- CreateTable
CREATE TABLE "_SetupTradeToStrategy" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SetupTradeToStrategy_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SetupTradeToStrategy_B_index" ON "_SetupTradeToStrategy"("B");

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_setupTradeId_fkey" FOREIGN KEY ("setupTradeId") REFERENCES "SetupTrade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SetupTradeToStrategy" ADD CONSTRAINT "_SetupTradeToStrategy_A_fkey" FOREIGN KEY ("A") REFERENCES "SetupTrade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SetupTradeToStrategy" ADD CONSTRAINT "_SetupTradeToStrategy_B_fkey" FOREIGN KEY ("B") REFERENCES "Strategy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
