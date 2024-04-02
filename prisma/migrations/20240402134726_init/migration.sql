/*
  Warnings:

  - You are about to drop the column `bookIds` on the `Collection` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "bookIds";

-- CreateTable
CREATE TABLE "CollectionPage" (
    "id" SERIAL NOT NULL,
    "collectionId" INTEGER NOT NULL,
    "pageId" INTEGER NOT NULL,

    CONSTRAINT "CollectionPage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CollectionPage" ADD CONSTRAINT "CollectionPage_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionPage" ADD CONSTRAINT "CollectionPage_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
