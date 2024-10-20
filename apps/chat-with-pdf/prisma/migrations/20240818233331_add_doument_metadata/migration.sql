-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "metadata" JSONB,
ALTER COLUMN "chatId" DROP NOT NULL;
