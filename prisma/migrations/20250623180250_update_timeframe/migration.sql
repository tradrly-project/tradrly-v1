-- CreateTable
CREATE TABLE "Timeframe" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Timeframe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TradeTimeframes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TradeTimeframes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Timeframe_code_key" ON "Timeframe"("code");

-- CreateIndex
CREATE INDEX "_TradeTimeframes_B_index" ON "_TradeTimeframes"("B");

-- AddForeignKey
ALTER TABLE "_TradeTimeframes" ADD CONSTRAINT "_TradeTimeframes_A_fkey" FOREIGN KEY ("A") REFERENCES "SetupTrade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TradeTimeframes" ADD CONSTRAINT "_TradeTimeframes_B_fkey" FOREIGN KEY ("B") REFERENCES "Timeframe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
