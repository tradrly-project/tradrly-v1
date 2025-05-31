/*
  Warnings:

  - You are about to drop the column `closedAt` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `openedAt` on the `Trade` table. All the data in the column will be lost.
  - Added the required column `date` to the `Trade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trade" DROP COLUMN "closedAt",
DROP COLUMN "openedAt",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;
