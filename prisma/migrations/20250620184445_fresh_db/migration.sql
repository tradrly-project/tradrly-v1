/*
  Warnings:

  - You are about to drop the `SetupTradePair` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SetupTradePair" DROP CONSTRAINT "SetupTradePair_pairId_fkey";

-- DropForeignKey
ALTER TABLE "SetupTradePair" DROP CONSTRAINT "SetupTradePair_setupTradeId_fkey";

-- DropTable
DROP TABLE "SetupTradePair";
