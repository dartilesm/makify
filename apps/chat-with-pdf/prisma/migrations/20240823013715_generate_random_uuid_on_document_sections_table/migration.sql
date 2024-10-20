/*
  Warnings:

  - The primary key for the `DocumentSections` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `DocumentSections` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "DocumentSections" DROP CONSTRAINT "DocumentSections_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "DocumentSections_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentSections_id_key" ON "DocumentSections"("id");
