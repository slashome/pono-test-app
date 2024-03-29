// Purpose: Entry point for the application. Creates a server that listens on port 3000 and handles incoming requests.
import * as http from 'http';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import {Router} from "./router";

const SERVER_PORT = 3000;

const server: http.Server = createServer((incomingMessage: IncomingMessage, serverResponse: ServerResponse) => {
    serverResponse.setHeader('Content-Type', 'application/json');
    let defaultAppResponse = { message: "Hello World" };
    const appResponse = Router.findRoute(incomingMessage);
    serverResponse.end(JSON.stringify(defaultAppResponse ?? appResponse));
});
server.listen(SERVER_PORT, () => {
    console.log(`Listening on port ${ SERVER_PORT }`);
});
