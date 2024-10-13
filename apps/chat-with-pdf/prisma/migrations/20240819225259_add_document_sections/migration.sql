/*
  Warnings:

  - You are about to drop the column `documentId` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `embedding` on the `Document` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[chatId]` on the table `Document` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_documentId_fkey";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "documentId";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "embedding";

-- CreateTable
CREATE TABLE "DocumentSections" (
    "id" TEXT NOT NULL,
    "embedding" vector(768),
    "chatId" TEXT,
    "text" TEXT,
    "pageNumber" INTEGER,
    "documentId" TEXT,

    CONSTRAINT "DocumentSections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DocumentSections_id_key" ON "DocumentSections"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Document_chatId_key" ON "Document"("chatId");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentSections" ADD CONSTRAINT "DocumentSections_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;
