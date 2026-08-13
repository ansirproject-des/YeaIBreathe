/*
  Warnings:

  - Changed the type of `mood` on the `Session` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `tech` on the `Session` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Mood" AS ENUM ('stressed', 'anxious', 'focus');

-- CreateEnum
CREATE TYPE "Tech" AS ENUM ('box_4444', 'breathing_478');

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "mood",
ADD COLUMN     "mood" "Mood" NOT NULL,
DROP COLUMN "tech",
ADD COLUMN     "tech" "Tech" NOT NULL;
