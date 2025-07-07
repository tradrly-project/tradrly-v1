-- DropForeignKey
ALTER TABLE "UserPsychology" DROP CONSTRAINT "UserPsychology_psychologyId_fkey";

-- AlterTable
ALTER TABLE "UserPsychology" ALTER COLUMN "psychologyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "UserPsychology" ADD CONSTRAINT "UserPsychology_psychologyId_fkey" FOREIGN KEY ("psychologyId") REFERENCES "Psychology"("id") ON DELETE SET NULL ON UPDATE CASCADE;
