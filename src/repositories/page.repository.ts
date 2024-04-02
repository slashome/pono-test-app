import {Book, Page, PrismaClient} from "@prisma/client";

export interface PagesUpdateQuery {
    pages: {
        deleteMany?: {
            id: {
                in: number[]
            }
        };
        create?: any;
        update?: {
            where: {
                id: number
            };
            data: Page;
        }[]
    }
}

export class PageRepository {

    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    public async deletePages(pageIds: any) {
        await this.prisma.page.deleteMany({
            where: {
                id: {
                    in: pageIds
                }
            }
        });
    }

    public getPagesUpdateQuery(existingBook: Book, modifiedBook: Book): PagesUpdateQuery {
        const existingPages = existingBook.pages;
        const modifiedPages = modifiedBook.pages;
        const pagesToDelete = existingPages.filter((existingPage: Page) => {
            return !modifiedPages.some((modifiedPage: Page) => {
                return existingPage.pageNumber === modifiedPage.pageNumber;
            });
        });
        const pagesToCreate = modifiedPages.filter((modifiedPage: Page) => {
            return !existingPages.some((existingPage: Page) => {
                return existingPage.pageNumber === modifiedPage.pageNumber;
            });
        });
        const pagesToUpdate = modifiedPages.filter((modifiedPage: Page) => {
            return existingPages.some((existingPage: Page) => {
                const isModifiedPage = existingPage.pageNumber === modifiedPage.pageNumber && existingPage.content !== modifiedPage.content
                // @TODO: Ugly hack to put the id of the modified page : need to be refactored
                if (isModifiedPage) {
                    modifiedPage.id = existingPage.id;
                }
                return isModifiedPage;
            });
        });

        const pagesToDeleteQuery = (pagesToDelete.length > 0) ? {
            deleteMany: {
                id: {
                    in: pagesToDelete.map((page: Page) => page.id)
                }
            }
        } : null;

        const pagesToCreateQuery = (pagesToCreate.length > 0) ? {
            create: pagesToCreate
        } : null;

        const pagesToUpdateQuery = (pagesToUpdate.length > 0) ? {
            update: pagesToUpdate.map((page: Page) => {
                return {
                    where: {
                        id: page.id
                    },
                    data: {
                        ...page
                    }
                }
            })
        } : null;

        return {
            pages: {
                ...pagesToDeleteQuery,
                ...pagesToCreateQuery,
                ...pagesToUpdateQuery,
            }
        };
    }
}
