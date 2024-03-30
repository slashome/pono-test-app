import {Controller} from "./controller";
import {IncomingMessage} from "http";
import {NewBook} from "./models";
import mongoose from "mongoose";

enum postRoutes {
    POST_BOOK = '/book',
}

export class Router {
    static async findRoute(incomingMessage: IncomingMessage): Promise<any> {
        const mongoose = await this.getMongoose();
        if (incomingMessage.url === postRoutes.POST_BOOK && incomingMessage.method === 'POST') {
            const body = await this.getBody(incomingMessage);
            return Controller.addBook(mongoose, body as NewBook);
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
                    resolve(JSON.parse(body));
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

    private static async getMongoose(): Promise<mongoose.Connection> {
        await mongoose.connect('mongodb://127.0.0.1:27017/pono-test-db');
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {  console.log("connecté à Mongoose")});
        return db;
    }
}
