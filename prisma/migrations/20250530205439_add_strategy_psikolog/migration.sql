/*
  Warnings:

  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TradeTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_userId_fkey";

-- DropForeignKey
ALTER TABLE "TradeTag" DROP CONSTRAINT "TradeTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "TradeTag" DROP CONSTRAINT "TradeTag_tradeId_fkey";

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "TradeTag";

-- CreateTable
CREATE TABLE "Psychology" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Psychology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Strategy" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Strategy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Psychology_userId_idx" ON "Psychology"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Strategy_userId_key" ON "Strategy"("userId");

-- AddForeignKey
ALTER TABLE "Psychology" ADD CONSTRAINT "Psychology_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Strategy" ADD CONSTRAINT "Strategy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
