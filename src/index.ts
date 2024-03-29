// Purpose: Entry point for the application. Creates a server that listens on port 3000 and handles incoming requests.
import * as http from 'http';
import { createServer, IncomingMessage, ServerResponse } from 'http';

const SERVER_PORT = 3000;

const server: http.Server = createServer((incomingMessage: IncomingMessage, serverResponse: ServerResponse) => {
   console.log(incomingMessage)
    serverResponse.setHeader('Content-Type', 'application/json');
    serverResponse.end('{message: "Hello World"}');
});
server.listen(SERVER_PORT, () => {
    console.log(`Listening on port ${ SERVER_PORT }`);
});
