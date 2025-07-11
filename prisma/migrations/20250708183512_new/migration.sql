/*
  Warnings:

  - You are about to drop the column `hidden` on the `UserTimeframe` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `UserTimeframe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserTimeframe" DROP COLUMN "hidden",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "timeframeId" DROP NOT NULL;
