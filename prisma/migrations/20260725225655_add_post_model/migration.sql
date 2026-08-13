-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('reflection', 'practice', 'tip');

-- CreateEnum
CREATE TYPE "PostVisibility" AS ENUM ('anyone', 'followers_only');

-- CreateEnum
CREATE TYPE "CommentPermission" AS ENUM ('anyone', 'followers_only');

-- CreateEnum
CREATE TYPE "PostAuthorType" AS ENUM ('public', 'anonymous');

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT NOT NULL,
    "type" "PostType" NOT NULL,
    "duration" INTEGER,
    "category" TEXT,
    "visibility" "PostVisibility" NOT NULL DEFAULT 'anyone',
    "commentPermission" "CommentPermission" NOT NULL DEFAULT 'anyone',
    "authorType" "PostAuthorType" NOT NULL DEFAULT 'public',

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
