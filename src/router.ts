import {Controller} from "./controller";
import {IncomingMessage} from "http";
import {NewBook} from "./models";
import {PrismaClient} from "@prisma/client";

enum postRoutes {
    POST_BOOK = '/book',
}

export class Router {
    static async findRoute(incomingMessage: IncomingMessage): Promise<any> {
        const prisma = new PrismaClient();
        if (incomingMessage.url === postRoutes.POST_BOOK && incomingMessage.method === 'POST') {
            console.log('ROUTE : add book');
            const body = await this.getBody(incomingMessage);
            return Controller.addBook(prisma, body as NewBook);
        }
        return null;
    }

    private static async getBody(incomingMessage: IncomingMessage): Promise<any> {
        return new Promise((resolve, reject) => {
            let body = '';
            incomingMessage.on('data', (chunk) => {
                body += chunk;
            });
            incomingMessage.on('end', () => {
                if (body) {
                    const jsonBody = JSON.parse(body);
                    console.log('jsonBody', jsonBody);
                    resolve(jsonBody);
                } else {
                    console.log('No body found', body);
                    reject(null);
                }
            });
            incomingMessage.on('error', (error) => {
                reject(error);
            });
        });
    }
}
