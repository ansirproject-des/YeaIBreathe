-- AlterTable
ALTER TABLE "PostComment" ADD COLUMN     "commentPermission" "CommentPermission" NOT NULL DEFAULT 'anyone',
ADD COLUMN     "visibility" "PostVisibility" NOT NULL DEFAULT 'anyone';
