import {CollectionPayload, ImportPayload, MessageResponse, NewBook, Pagination} from "./models";
import {Book, Page, PrismaClient} from "@prisma/client";
import {PageRepository, PagesUpdateQuery} from "./repositories/page.repository";
import {BookRepository} from "./repositories/book.repository";
import {bookPresenter, fullBookPresenter} from "./presenters";
import * as fs from "fs";
import {BookPriceFromAPI, PriceApi} from "./price-api";
import {CollectionRepository} from "./repositories/collection.repository";
import {CollectionPageRepository} from "./repositories/collectionPage.repository";

enum ImportTypes {
    FOLDER = 'folder',
    FILE = 'file',
}

export class Controller {

    private pageRepository: PageRepository;
    private bookRepository: BookRepository;
    private collectionRepository: CollectionRepository;
    private collectionPageRepository: CollectionPageRepository;
    private priceApi: PriceApi;

    constructor() {
        const prisma = new PrismaClient();
        this.pageRepository = new PageRepository(prisma);
        this.bookRepository = new BookRepository(prisma);
        this.collectionRepository = new CollectionRepository(prisma);
        this.collectionPageRepository = new CollectionPageRepository(prisma);
        this.priceApi = new PriceApi();
    }

    async addBook(newBook: NewBook): Promise<void> {
        return await this.bookRepository.addBook(newBook);
    }

    async getFullBook(bookId: number) {
        const book = await this.bookRepository.getBookById(bookId, {pages: true});
        if (!book || !bookId) {
            return {message: 'Book not found'}
        }
        return fullBookPresenter(book);
    }

    async getBooks(pagination: Pagination): Promise<Book[] | MessageResponse> {
        const books = await this.bookRepository.getBooksWithPagination(pagination);
        if (books.length === 0 || !books) {
            return {message: 'No books found'};
        }
        return new Promise(async (resolve, reject) => {
            const booksPricesPromises: Promise<BookPriceFromAPI>[] = books.map((book: Book) => {
                return this.priceApi.getPrice(book.id);
            });
            const bookPrices: BookPriceFromAPI[] = await Promise.all(booksPricesPromises);
            const booksWithPrices = books.map((book: Book) => {
                const bookPrice = bookPrices.find((price: BookPriceFromAPI) => price.bookId === book.id);
                return {
                    ...book,
                    price: bookPrice?.price,
                }
            });
            const presentedBooks = booksWithPrices.map(bookPresenter);
            resolve(presentedBooks);
        });
    }

    async updateBook(bookId: number, modifiedBook: Book): Promise<any> {
        const existingBook = await this.bookRepository.getBookById(bookId, {pages: true});
        if (!existingBook || !bookId) {
            return {message: 'Book not found'};
        }
        const pagesUpdatingQuery = this.pageRepository.getPagesUpdateQuery(existingBook, modifiedBook);
        const updatedBook = await this.bookRepository.updateBook(bookId, pagesUpdatingQuery, modifiedBook);
        return fullBookPresenter(updatedBook);
    }

    async createCollection(collectionPayload: CollectionPayload): Promise<any> {
        const books: Book[] = await this.bookRepository.getBooksByIds(collectionPayload.bookIds, {pages: true});
        if (books.length !== collectionPayload.bookIds.length) {
            return {message: 'Some books not found'};
        }
        const pages: Page[] = books.map((book: Book) => {
            return book.pages;
        }).flat(1);

        let collection = await this.collectionRepository.getCollection(collectionPayload.title);
        if (!collection) {
            collection = await this.collectionRepository.createCollection(collectionPayload.title);
        }

        await this.collectionPageRepository.addPagesToCollection(collection.id, pages);
        return {message: 'Collection created', collection};

    }

    async deleteBook(bookId: number) {
        const book = await this.bookRepository.getBookById(bookId, {pages: true});
        if (!book || !bookId) {
            return {message: 'Book not found'}
        }
        const pageIds = book.pages.map((page: Page) => {
            return page.id;
        });

        await this.pageRepository.deletePages(pageIds);
        await this.bookRepository.deleteBook(bookId);

        return {message: 'Book deleted'};
    }

    public async importBooks(payload: ImportPayload): Promise<any> {
        if (payload.type === ImportTypes.FOLDER) {
            return this.importBooksFromFolder(payload.path);
        }
    }

    private async importBooksFromFolder(path: string): Promise<any> {
        let files;
        try {
            files = fs.readdirSync(path);
        } catch (e) {
            return {message: 'Error reading folder'};
        }
        const foldersToIgnore = ['.DS_Store'];
        const books: Promise<any>[] = files
            .filter((file: string) => !foldersToIgnore.includes(file))
            .map((bookFolderName: string) => {
            const readmeContent = fs.readFileSync(path + '/' + bookFolderName + '/readme.md', 'utf8');

            const bookInformations = readmeContent.match(/Title: (.+)|Author: (.+)|Release: (.+)/g) as string[];

            const bookPages = fs.readdirSync(path + '/' + bookFolderName)
                .filter((page: string) => page.includes('.txt'))
                .map((page: string) => {
                    return {
                        content: fs.readFileSync(path + '/' + bookFolderName + '/' + page, 'utf8'),
                        pageNumber: parseInt(page.split('.')[0]),
                    }
                });
            const book: Book = {
                title: bookInformations[0].replace('Title: ', ''),
                author: bookInformations[1].replace('Author: ', ''),
                publicationDate: new Date(bookInformations[2].replace('Release: ', '')),
                pages: bookPages,
            };
            return this.bookRepository.addBook(book);
        });
        return await Promise.all(books);
    }
}
