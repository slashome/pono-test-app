/*
  Warnings:

  - A unique constraint covering the columns `[bookId,pageNumber]` on the table `Page` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Page_bookId_pageNumber_key" ON "Page"("bookId", "pageNumber");
