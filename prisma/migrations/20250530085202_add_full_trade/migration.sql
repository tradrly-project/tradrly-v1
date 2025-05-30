/*
  Warnings:

  - You are about to drop the column `setupNote` on the `Trade` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tradeId]` on the table `JournalEntry` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tradeId` to the `JournalEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profitLoss` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `riskRatio` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stoploss` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `takeProfit` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `result` on the `Trade` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Result" AS ENUM ('win', 'loss', 'bep');

-- AlterTable
ALTER TABLE "JournalEntry" ADD COLUMN     "tradeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Trade" DROP COLUMN "setupNote",
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "profitLoss" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "psychology" TEXT,
ADD COLUMN     "riskRatio" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "stoploss" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "strategi" TEXT,
ADD COLUMN     "takeProfit" DECIMAL(65,30) NOT NULL,
DROP COLUMN "result",
ADD COLUMN     "result" "Result" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "JournalEntry_tradeId_key" ON "JournalEntry"("tradeId");

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "Trade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
