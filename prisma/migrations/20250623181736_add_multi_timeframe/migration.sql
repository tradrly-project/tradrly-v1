/*
  Warnings:

  - You are about to drop the column `timeframe` on the `SetupTrade` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Timeframe` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Timeframe` table. All the data in the column will be lost.
  - You are about to drop the `_TradeTimeframes` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[code,userId]` on the table `Timeframe` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_TradeTimeframes" DROP CONSTRAINT "_TradeTimeframes_A_fkey";

-- DropForeignKey
ALTER TABLE "_TradeTimeframes" DROP CONSTRAINT "_TradeTimeframes_B_fkey";

-- DropIndex
DROP INDEX "Timeframe_code_key";

-- AlterTable
ALTER TABLE "SetupTrade" DROP COLUMN "timeframe";

-- AlterTable
ALTER TABLE "Timeframe" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "userId" TEXT;

-- DropTable
DROP TABLE "_TradeTimeframes";

-- CreateTable
CREATE TABLE "_TimeframesOnSetupTrade" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TimeframesOnSetupTrade_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TimeframesOnSetupTrade_B_index" ON "_TimeframesOnSetupTrade"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Timeframe_code_userId_key" ON "Timeframe"("code", "userId");

-- AddForeignKey
ALTER TABLE "Timeframe" ADD CONSTRAINT "Timeframe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TimeframesOnSetupTrade" ADD CONSTRAINT "_TimeframesOnSetupTrade_A_fkey" FOREIGN KEY ("A") REFERENCES "SetupTrade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TimeframesOnSetupTrade" ADD CONSTRAINT "_TimeframesOnSetupTrade_B_fkey" FOREIGN KEY ("B") REFERENCES "Timeframe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
