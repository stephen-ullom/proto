// import * as WebSocket from "ws";

import { Content } from "../models/html.model";

export function render(...content: Content[]): void {
  // const sanatizedContent = content.join("").replace(/\n/g, "");
  // const server = new WebSocket.Server({ port: 2000 });
  // server.on("connection", (ws) => {
  //   ws.send(sanatizedContent);

  //   ws.on("message", (message) => {
  //     console.log(String(message));
  //   });
  // });

  const server = Bun.serve<{ authToken: string }>({
    fetch(req, server) {
      const success = server.upgrade(req);
      if (success) {
        // Bun automatically returns a 101 Switching Protocols
        // if the upgrade succeeds
        return undefined;
      }

      // handle HTTP request normally
      return new Response("Hello world!");
    },
    websocket: {
      // this is called when a message is received
      async message(ws, message) {
        console.log(`Received ${message}`);
        // send back a message

        // const sanatizedContent = content.join("").replace(/\n/g, "");

        ws.send(`You said: ${message}`);
      },
    },
  });

  console.log(`Listening on ${server.hostname}:${server.port}`);
}
