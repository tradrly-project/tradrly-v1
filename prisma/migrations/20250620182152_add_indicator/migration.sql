/*
  Warnings:

  - You are about to drop the column `appliesToAllPairs` on the `SetupTrade` table. All the data in the column will be lost.
  - You are about to drop the column `checklist` on the `SetupTrade` table. All the data in the column will be lost.
  - You are about to drop the column `pairId` on the `SetupTrade` table. All the data in the column will be lost.
  - You are about to drop the column `rrRatio` on the `SetupTrade` table. All the data in the column will be lost.
  - You are about to drop the `ChecklistItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `indicator` to the `SetupTrade` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ChecklistItem" DROP CONSTRAINT "ChecklistItem_setupTradeId_fkey";

-- AlterTable
ALTER TABLE "SetupTrade" DROP COLUMN "appliesToAllPairs",
DROP COLUMN "checklist",
DROP COLUMN "pairId",
DROP COLUMN "rrRatio",
ADD COLUMN     "indicator" TEXT NOT NULL,
ADD COLUMN     "indicatorId" TEXT;

-- DropTable
DROP TABLE "ChecklistItem";

-- CreateTable
CREATE TABLE "Indicator" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Indicator_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SetupTrade" ADD CONSTRAINT "SetupTrade_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "Indicator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Indicator" ADD CONSTRAINT "Indicator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
