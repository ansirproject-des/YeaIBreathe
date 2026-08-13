/*
  Warnings:

  - The `preferredLanguage` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Language" AS ENUM ('en', 'uk');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "preferredLanguage",
ADD COLUMN     "preferredLanguage" "Language" NOT NULL DEFAULT 'en';
