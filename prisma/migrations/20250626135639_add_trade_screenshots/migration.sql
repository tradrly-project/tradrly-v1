-- CreateEnum
CREATE TYPE "ScreenshotType" AS ENUM ('BEFORE', 'AFTER');

-- CreateTable
CREATE TABLE "TradeScreenshot" (
    "id" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "type" "ScreenshotType" NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TradeScreenshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TradeScreenshot_tradeId_idx" ON "TradeScreenshot"("tradeId");

-- AddForeignKey
ALTER TABLE "TradeScreenshot" ADD CONSTRAINT "TradeScreenshot_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "Trade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
