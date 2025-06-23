/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Indicator` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Indicator` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Indicator" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Indicator_code_key" ON "Indicator"("code");
