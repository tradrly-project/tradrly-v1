-- DropForeignKey
ALTER TABLE "UserIndicator" DROP CONSTRAINT "UserIndicator_indicatorId_fkey";

-- DropForeignKey
ALTER TABLE "UserPair" DROP CONSTRAINT "UserPair_pairId_fkey";

-- AlterTable
ALTER TABLE "UserIndicator" ALTER COLUMN "indicatorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserPair" ALTER COLUMN "pairId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "UserPair" ADD CONSTRAINT "UserPair_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "Pair"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserIndicator" ADD CONSTRAINT "UserIndicator_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "Indicator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
