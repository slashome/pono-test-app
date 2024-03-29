import {Controller} from "./controller";
import {IncomingMessage} from "http";
import {NewBook} from "./models";

enum postRoutes {
    POST_BOOK = '/book',
}

export class Router {
    static findRoute(incomingMessage: IncomingMessage) {
        if (incomingMessage.url === postRoutes.POST_BOOK && incomingMessage.method === 'POST') {
            const body = this.getBody(incomingMessage);
            return Controller.addBook(body as NewBook);
        }
        return null;
    }

    private static getBody(incomingMessage: IncomingMessage): any {
        let body = '';
        incomingMessage.on('data', (chunk) => {
            body += chunk;
        });
        return JSON.parse(body);
    }
}
