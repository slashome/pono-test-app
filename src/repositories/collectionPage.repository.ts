import {Page, PrismaClient} from "@prisma/client";

export class CollectionPageRepository {
    constructor(
        private prisma: PrismaClient
    ) {}

    async addPagesToCollection(collectionId: number, pages: Page[]) {
        return this.prisma.collectionPage.createMany({
            data: pages.map((page: Page) => {
                return {
                    collectionId,
                    pageId: page.id,
                }
            }),
        });
    }
}
