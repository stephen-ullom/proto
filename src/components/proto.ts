import * as WebSocket from "ws";

import { Scene } from "../models/html.model";

export async function proto(...scenes: Scene[]): Promise<void> {
  // const sanatizedContent = content.join("").replace(/\n/g, "");

  const content = await scenes[0].scene();

  console.log("Loaded", scenes[0].name);

  const server = new WebSocket.Server({ port: 2000 });

  server.on("connection", (ws) => {
    ws.send(content);

    ws.on("message", (message) => {
      console.log(String(message));
    });
  });
}
