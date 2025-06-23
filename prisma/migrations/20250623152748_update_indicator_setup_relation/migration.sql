/*
  Warnings:

  - You are about to drop the column `indicatorId` on the `SetupTrade` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Indicator" DROP CONSTRAINT "Indicator_userId_fkey";

-- DropIndex
DROP INDEX "Indicator_code_key";

-- AlterTable
ALTER TABLE "SetupTrade" DROP COLUMN "indicatorId";

-- CreateIndex
CREATE INDEX "Indicator_userId_idx" ON "Indicator"("userId");

-- AddForeignKey
ALTER TABLE "Indicator" ADD CONSTRAINT "Indicator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
