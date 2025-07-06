/*
  Warnings:

  - You are about to drop the column `isActive` on the `UserPair` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserPairStatus" AS ENUM ('active', 'nonactive', 'hidden');

-- AlterTable
ALTER TABLE "UserPair" DROP COLUMN "isActive",
ADD COLUMN     "status" "UserPairStatus" NOT NULL DEFAULT 'active';
