import {Book, Page, Prisma, PrismaClient} from "@prisma/client";
import {NewBook, Pagination} from "../models";
import {PagesUpdateQuery} from "./page.repository";

export class BookRepository {

    constructor(
        private prisma: PrismaClient
    ) {}

    public async addBook(newBook: NewBook) {
        return this.prisma.book.create({
            data: {
                ...newBook,
                publicationDate: new Date(newBook.publicationDate),
                pages: {
                    create: newBook.pages,
                }
            }
        }).catch((error: any) => {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    return {error: true, message: 'Book title already exists'};
                }
            }
            throw error;
        });
    }

    public async deleteBook(bookId: number) {
        await this.prisma.book.delete({
            where: {
                id: bookId
            }
        });
    }

    public async updateBook(bookId: number, pagesUpdateQuery: PagesUpdateQuery, modifiedBook: Book): Promise<Book> {
        return this.prisma.book.update({
            where: {
                id: bookId
            },
            data: {
                ...modifiedBook,
                publicationDate: new Date(modifiedBook.publicationDate),
                ...pagesUpdateQuery,
            }
        });
    }

    public async getBookById(bookId: number, include: {  pages: boolean }): Promise<Book> {
        return this.prisma.book.findUnique({
            include: include,
            where: {
                id: bookId
            }
        });
    }

    public async getBooksByIds(booksIds: number[], include: { pages: boolean }): Promise<Book[]> {
        return this.prisma.book.findMany({
            include: include,
            where: {
                id: {
                    in: booksIds
                }
            }
        });
    }

    public async getBooksWithPagination(pagination: Pagination): Promise<Book[]> {
        return this.prisma.book.findMany({
            ...pagination,
            select: {
                id: true,
                title: true,
                publicationDate: true,
            }
        });
    }
}
