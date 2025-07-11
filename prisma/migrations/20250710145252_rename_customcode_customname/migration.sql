/*
  Warnings:

  - You are about to drop the column `customCode` on the `UserIndicator` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserIndicator" DROP COLUMN "customCode",
ADD COLUMN     "customName" TEXT;
