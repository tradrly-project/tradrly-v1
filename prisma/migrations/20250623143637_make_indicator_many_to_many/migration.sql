-- DropForeignKey
ALTER TABLE "SetupTrade" DROP CONSTRAINT "SetupTrade_indicatorId_fkey";

-- CreateTable
CREATE TABLE "_SetupTradeIndicators" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SetupTradeIndicators_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SetupTradeIndicators_B_index" ON "_SetupTradeIndicators"("B");

-- AddForeignKey
ALTER TABLE "_SetupTradeIndicators" ADD CONSTRAINT "_SetupTradeIndicators_A_fkey" FOREIGN KEY ("A") REFERENCES "Indicator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SetupTradeIndicators" ADD CONSTRAINT "_SetupTradeIndicators_B_fkey" FOREIGN KEY ("B") REFERENCES "SetupTrade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
