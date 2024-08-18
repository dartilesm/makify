-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_documentId_fkey";

-- AlterTable
ALTER TABLE "Chat" ALTER COLUMN "documentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "embedding" vector(768);

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;
