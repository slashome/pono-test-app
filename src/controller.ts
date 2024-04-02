import {NewBook, Pagination} from "./models";
import {Book, Page} from "@prisma/client";
import {PageRepository} from "./repositories/page.repository";
import {BookRepository} from "./repositories/book.repository";
import {bookPresenter, fullBookPresenter} from "./presenters";

export class Controller {

    private pageRepository: PageRepository;
    private bookRepository: BookRepository;

    constructor() {
        this.pageRepository = new PageRepository();
        this.bookRepository = new BookRepository();
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

    async getBooks(pagination: Pagination): Promise<Book[]> {
        const books = await this.bookRepository.getBooksWithPagination(pagination);
        return new Promise((resolve, reject) => {
            if (!books) {
                reject({message: 'No books found'});
            }
            const presentedBooks = books.map(bookPresenter);
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

    async deleteBook(bookId: number) {
        const book = await this.bookRepository.getBookById(bookId, {pages: false});
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
}
