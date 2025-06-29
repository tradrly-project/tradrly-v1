/*
  Warnings:

  - You are about to drop the column `userId` on the `Timeframe` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Timeframe" DROP CONSTRAINT "Timeframe_userId_fkey";

-- DropIndex
DROP INDEX "Timeframe_code_userId_key";

-- AlterTable
ALTER TABLE "Timeframe" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "UserTimeframe" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timeframeId" TEXT NOT NULL,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "customCode" TEXT,

    CONSTRAINT "UserTimeframe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserTimeframe_userId_timeframeId_key" ON "UserTimeframe"("userId", "timeframeId");

-- AddForeignKey
ALTER TABLE "UserTimeframe" ADD CONSTRAINT "UserTimeframe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTimeframe" ADD CONSTRAINT "UserTimeframe_timeframeId_fkey" FOREIGN KEY ("timeframeId") REFERENCES "Timeframe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
