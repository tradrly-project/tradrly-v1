/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Indicator` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Timeframe` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Indicator_code_key" ON "Indicator"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Timeframe_code_key" ON "Timeframe"("code");
