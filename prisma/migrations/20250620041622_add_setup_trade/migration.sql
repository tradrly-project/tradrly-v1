-- CreateTable
CREATE TABLE "SetupTrade" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "strategy" TEXT NOT NULL,
    "pairId" TEXT,
    "appliesToAllPairs" BOOLEAN NOT NULL DEFAULT false,
    "timeframe" TEXT NOT NULL,
    "rrRatio" TEXT NOT NULL,
    "checklist" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SetupTrade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SetupTrade_userId_idx" ON "SetupTrade"("userId");

-- CreateIndex
CREATE INDEX "SetupTrade_pairId_idx" ON "SetupTrade"("pairId");

-- CreateIndex
CREATE UNIQUE INDEX "SetupTrade_userId_name_key" ON "SetupTrade"("userId", "name");

-- AddForeignKey
ALTER TABLE "SetupTrade" ADD CONSTRAINT "SetupTrade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetupTrade" ADD CONSTRAINT "SetupTrade_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "Pair"("id") ON DELETE SET NULL ON UPDATE CASCADE;
