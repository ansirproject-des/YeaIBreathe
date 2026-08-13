/*
  Warnings:

  - You are about to drop the column `CheckIn` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "CheckIn",
ADD COLUMN     "checkIn" "CheckIn";
