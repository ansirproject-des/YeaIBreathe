-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('in_progress', 'completed');

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "status" "SessionStatus" NOT NULL DEFAULT 'in_progress';
