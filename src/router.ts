import {Controller} from "./controller";
import {IncomingMessage} from "http";
import {ImportPayload, NewBook, Pagination} from "./models";
import {Book, PrismaClient} from "@prisma/client";

enum postRoutes {
    POST_BOOK = '/book',
    GET_BOOK = '/book',
    GET_BOOKS = '/books',
    UPDATE_BOOK = '/book',
    DELETE_BOOK = '/book',
    IMPORT = '/import',
}

enum httpMethods {
    POST = 'POST',
    GET = 'GET',
    DELETE = 'DELETE',
    PUT = 'PUT',
}

export class Router
{
    private controller: Controller;

    constructor() {
        this.controller = new Controller();
    }
    async findRoute(incomingMessage: IncomingMessage): Promise<any> {
        const prisma = new PrismaClient();
        if (this.testRoute(incomingMessage, postRoutes.POST_BOOK, httpMethods.POST)) {
            console.info('ROUTE : add book');
            const payload = await this.getRequestPayload(incomingMessage);
            return this.controller.addBook(payload as NewBook);
        }
        if (this.testRoute(incomingMessage, postRoutes.GET_BOOKS, httpMethods.GET)) {
            console.info('ROUTE : get books');
            const payload = await this.getRequestPayload(incomingMessage);
            return this.controller.getBooks(payload as Pagination);
        }
        if (this.testRoute(incomingMessage, postRoutes.GET_BOOK, httpMethods.GET)) {
            console.info('ROUTE : get book');
            const bookId = this.getIdFromUrl(incomingMessage.url);
            return this.controller.getFullBook(bookId);
        }
        if (this.testRoute(incomingMessage, postRoutes.UPDATE_BOOK, httpMethods.PUT)) {
            console.info('ROUTE : update book');
            const bookId = this.getIdFromUrl(incomingMessage.url);
            const payload = await this.getRequestPayload(incomingMessage);
            return this.controller.updateBook(bookId, payload as Book);
        }
        if (this.testRoute(incomingMessage, postRoutes.DELETE_BOOK, httpMethods.DELETE)) {
            console.info('ROUTE : delete book');
            const bookId = this.getIdFromUrl(incomingMessage.url);
            return this.controller.deleteBook(bookId);
        }
        if (this.testRoute(incomingMessage, postRoutes.IMPORT, httpMethods.POST)) {
            console.info('ROUTE : mass import books');
            const payload = await this.getRequestPayload(incomingMessage);
            return this.controller.importBooks(payload as ImportPayload);
        }
         return null;
    }

    private async getRequestPayload(incomingMessage: IncomingMessage): Promise<any> {
        return new Promise((resolve, reject) => {
            let body = '';
            incomingMessage.on('data', (chunk) => {
                body += chunk;
            });
            incomingMessage.on('end', () => {
                if (!body) {
                    console.info('Request body: No body found');
                    reject(null);
                }
                const jsonBody = JSON.parse(body);
                console.info('Request payload', jsonBody);
                resolve(jsonBody);
            });
            incomingMessage.on('error', (error) => {
                reject(error);
            });
        });
    }
    /*
    @TODO: Fix url collision if ID is present in the URL : /book/1 = /book > for now /book == /books
     */
    private testRoute(incomingMessage: IncomingMessage, endpoint: postRoutes, method: httpMethods): boolean {
        if (!incomingMessage.url) {
            return false;
        }
        return incomingMessage.url?.includes(endpoint) && method === incomingMessage.method;
    }

    private getIdFromUrl(url: string | undefined): number {
        const digits = url?.match(/\d+/g);
        if (!digits) {
            return NaN;
        }
        const id = parseInt(digits[0]);
        console.info('ID from URL', id);
        return id;
    }
}
