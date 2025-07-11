/*
  Warnings:

  - You are about to drop the column `code` on the `Timeframe` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Timeframe` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `group` to the `Timeframe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Timeframe` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TimeFrameGroup" AS ENUM ('second', 'minute', 'hour', 'dayweekmonth');

-- DropIndex
DROP INDEX "Timeframe_code_key";

-- AlterTable
ALTER TABLE "Timeframe" DROP COLUMN "code",
ADD COLUMN     "group" "TimeFrameGroup" NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Timeframe_name_key" ON "Timeframe"("name");
