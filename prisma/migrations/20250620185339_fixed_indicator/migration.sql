/*
  Warnings:

  - You are about to drop the column `indicator` on the `SetupTrade` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "SetupTrade_userId_idx";

-- AlterTable
ALTER TABLE "SetupTrade" DROP COLUMN "indicator";
