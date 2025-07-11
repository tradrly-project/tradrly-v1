/*
  Warnings:

  - You are about to drop the column `customName` on the `UserIndicator` table. All the data in the column will be lost.
  - You are about to drop the column `customCode` on the `UserTimeframe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserIndicator" DROP COLUMN "customName",
ADD COLUMN     "customCode" TEXT;

-- AlterTable
ALTER TABLE "UserTimeframe" DROP COLUMN "customCode",
ADD COLUMN     "customName" TEXT;
