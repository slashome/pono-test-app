/*
  Warnings:

  - You are about to drop the column `collectionId` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `collectionId` on the `Page` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_collectionId_fkey";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "collectionId";

-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "bookIds" JSONB NOT NULL DEFAULT '[]';

-- AlterTable
ALTER TABLE "Page" DROP COLUMN "collectionId";
