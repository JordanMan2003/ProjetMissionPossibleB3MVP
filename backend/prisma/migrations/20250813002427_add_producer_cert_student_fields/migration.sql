-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isStudent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "producerCertified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "studentProof" TEXT;
