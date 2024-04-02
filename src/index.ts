// Purpose: Entry point for the application. Creates a server that listens on port 3000 and handles incoming requests.
import * as http from 'http';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import {Router} from "./router";

const SERVER_PORT = 3000;

const server: http.Server = createServer((incomingMessage: IncomingMessage, serverResponse: ServerResponse) => {
    serverResponse.setHeader('Content-Type', 'application/json');
    console.info('Incoming request', incomingMessage.url);
    const router = new Router();
    const appResponse = router.findRoute(incomingMessage);
    appResponse.then((response) => {
        serverResponse.end(JSON.stringify(response ?? { message: "Endpoint not found" }));
    }).catch((error) => {
        console.error('Error processing request', error);
        serverResponse.end(JSON.stringify({message: "Error processing request"}));
    });
});
server.listen(SERVER_PORT, () => {
    console.info(`Listening on port ${ SERVER_PORT }`);
});
