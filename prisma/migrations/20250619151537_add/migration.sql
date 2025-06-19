/*
  Warnings:

  - You are about to drop the column `psychology` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `strategi` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the `JournalEntry` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,name]` on the table `Strategy` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Trade` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "JournalEntry" DROP CONSTRAINT "JournalEntry_tradeId_fkey";

-- DropForeignKey
ALTER TABLE "JournalEntry" DROP CONSTRAINT "JournalEntry_userId_fkey";

-- DropIndex
DROP INDEX "Strategy_userId_key";

-- AlterTable
ALTER TABLE "Trade" DROP COLUMN "psychology",
DROP COLUMN "strategi",
ADD COLUMN     "content" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "JournalEntry";

-- CreateTable
CREATE TABLE "_PsychologyToTrade" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PsychologyToTrade_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_StrategyToTrade" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_StrategyToTrade_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PsychologyToTrade_B_index" ON "_PsychologyToTrade"("B");

-- CreateIndex
CREATE INDEX "_StrategyToTrade_B_index" ON "_StrategyToTrade"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Strategy_userId_name_key" ON "Strategy"("userId", "name");

-- AddForeignKey
ALTER TABLE "_PsychologyToTrade" ADD CONSTRAINT "_PsychologyToTrade_A_fkey" FOREIGN KEY ("A") REFERENCES "Psychology"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PsychologyToTrade" ADD CONSTRAINT "_PsychologyToTrade_B_fkey" FOREIGN KEY ("B") REFERENCES "Trade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StrategyToTrade" ADD CONSTRAINT "_StrategyToTrade_A_fkey" FOREIGN KEY ("A") REFERENCES "Strategy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StrategyToTrade" ADD CONSTRAINT "_StrategyToTrade_B_fkey" FOREIGN KEY ("B") REFERENCES "Trade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
