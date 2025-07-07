/*
  Warnings:

  - You are about to drop the column `hidden` on the `UserIndicator` table. All the data in the column will be lost.
  - You are about to drop the column `hidden` on the `UserPsychology` table. All the data in the column will be lost.
  - You are about to drop the `_SetupTradeToStrategy` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Strategy" DROP CONSTRAINT "Strategy_userId_fkey";

-- DropForeignKey
ALTER TABLE "_SetupTradeToStrategy" DROP CONSTRAINT "_SetupTradeToStrategy_A_fkey";

-- DropForeignKey
ALTER TABLE "_SetupTradeToStrategy" DROP CONSTRAINT "_SetupTradeToStrategy_B_fkey";

-- AlterTable
ALTER TABLE "UserIndicator" DROP COLUMN "hidden";

-- AlterTable
ALTER TABLE "UserPsychology" DROP COLUMN "hidden";

-- DropTable
DROP TABLE "_SetupTradeToStrategy";

-- CreateTable
CREATE TABLE "userStrategy" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "strategyId" TEXT,
    "customName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "userStrategy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SetupTradeTouserStrategy" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SetupTradeTouserStrategy_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "userStrategy_userId_strategyId_key" ON "userStrategy"("userId", "strategyId");

-- CreateIndex
CREATE INDEX "_SetupTradeTouserStrategy_B_index" ON "_SetupTradeTouserStrategy"("B");

-- AddForeignKey
ALTER TABLE "userStrategy" ADD CONSTRAINT "userStrategy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userStrategy" ADD CONSTRAINT "userStrategy_strategyId_fkey" FOREIGN KEY ("strategyId") REFERENCES "Strategy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SetupTradeTouserStrategy" ADD CONSTRAINT "_SetupTradeTouserStrategy_A_fkey" FOREIGN KEY ("A") REFERENCES "SetupTrade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SetupTradeTouserStrategy" ADD CONSTRAINT "_SetupTradeTouserStrategy_B_fkey" FOREIGN KEY ("B") REFERENCES "userStrategy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
