import * as http from "http";

import { Content } from "../models/html.model";

export function render(...content: Content[]) {
  const server = http.createServer((req, res) => {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Access-Control-Allow-Origin": "*",
      Connection: "keep-alive",
    });
    const sanatizedContent = content.join("").replace(/\n/g, "");
    res.write(`data: ${sanatizedContent}\n\n`);
  });
  server.listen(2000, () => {
    console.log(`Server listening on http://localhost:8000`);
  });
}
