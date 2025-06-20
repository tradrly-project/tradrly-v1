-- CreateTable
CREATE TABLE "ChecklistItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "setupTradeId" TEXT NOT NULL,

    CONSTRAINT "ChecklistItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChecklistItem_setupTradeId_idx" ON "ChecklistItem"("setupTradeId");

-- AddForeignKey
ALTER TABLE "ChecklistItem" ADD CONSTRAINT "ChecklistItem_setupTradeId_fkey" FOREIGN KEY ("setupTradeId") REFERENCES "SetupTrade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
