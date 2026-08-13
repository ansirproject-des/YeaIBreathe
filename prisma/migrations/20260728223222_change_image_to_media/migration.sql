/*
  Warnings:

  - The values [image] on the enum `PostAttachmentType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PostAttachmentType_new" AS ENUM ('media', 'audio', 'document');
ALTER TABLE "PostAttachment" ALTER COLUMN "type" TYPE "PostAttachmentType_new" USING ("type"::text::"PostAttachmentType_new");
ALTER TYPE "PostAttachmentType" RENAME TO "PostAttachmentType_old";
ALTER TYPE "PostAttachmentType_new" RENAME TO "PostAttachmentType";
DROP TYPE "public"."PostAttachmentType_old";
COMMIT;
