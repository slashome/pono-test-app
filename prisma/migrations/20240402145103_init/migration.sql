/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Collection` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Collection_title_key" ON "Collection"("title");
