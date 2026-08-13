-- CreateEnum
CREATE TYPE "CheckIn" AS ENUM ('better', 'same', 'tense');

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "CheckIn" "CheckIn";
