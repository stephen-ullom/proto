#!/usr/bin/env node

import { exec } from "child_process";
import { readFile } from "fs/promises";
import { createServer } from "http";
import { transpile } from "typescript";

// import  from "typescript";

const args = process.argv.slice(2);

init();

async function init() {
  console.log(args);

  try {
    const mainSource = await readFile("main.ts", { encoding: "utf-8" });
    const main = transpile(mainSource);

    // const hostname = "localhost";
    // const port = 8000;

    // const server = createServer((req, res) => {
    //   // res.statusCode = 200;
    //   // res.setHeader("Content-Type", "text/plain");
    //   res.writeHead(200, { "Content-Type": "text/html" });
    //   res.end("Hello World");
    // });

    // server.listen(port, hostname, () => {
    //   console.log(`Server running at http://${hostname}:${port}/`);
    // });

    eval(main);
    // console.log(main);
  } catch (error) {
    throw error;
  }
}
