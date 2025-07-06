/*
  Warnings:

  - You are about to drop the column `status` on the `UserPair` table. All the data in the column will be lost.
  - Added the required column `type` to the `Pair` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TypePair" AS ENUM ('forex', 'crypto', 'stock', 'index');

-- AlterTable
ALTER TABLE "Pair" ADD COLUMN     "type" "TypePair" NOT NULL;

-- AlterTable
ALTER TABLE "UserPair" DROP COLUMN "status";

-- DropEnum
DROP TYPE "UserPairStatus";
