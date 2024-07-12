/*
  Warnings:

  - The `messages` column on the `Chat` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Chat" ALTER COLUMN "documentMetadata" DROP NOT NULL,
ALTER COLUMN "documentUrl" DROP NOT NULL,
DROP COLUMN "messages",
ADD COLUMN     "messages" JSONB;
