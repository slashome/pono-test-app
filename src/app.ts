import 'reflect-metadata';
import * as http from 'http';
import { Container } from 'typedi';
import { createExpressServer, useContainer } from 'routing-controllers';
import { SERVER_PORT } from './config/config';
import { AppController } from './web/app-controller';

useContainer(Container);

export class App {

    private httpServer!: http.Server;

    constructor() {
    }

    async start(): Promise<http.Server> {
        return this.startHttpServer();
    }

    private startHttpServer(): Promise<http.Server> {
        return new Promise((resolve, reject) => {
            this.httpServer = createExpressServer({
                controllers: [
                    AppController,
                ],
            });
            this.httpServer.listen(SERVER_PORT, () => {
                console.log('server running on *:' + SERVER_PORT);
                resolve(this.httpServer);
            });
        });
    }
}
