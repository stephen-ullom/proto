import * as WebSocket from "ws";

import { Html } from "../models/html.model";

export function render(...content: Html[]) {
  const sanatizedContent = content.join("").replace(/\n/g, "");
  const server = new WebSocket.Server({ port: 2000 });
  server.on("connection", (ws) => {
    ws.send(sanatizedContent);

    ws.on("message", (message) => {
      console.log(String(message));
    });
  });
}
