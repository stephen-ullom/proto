#!/usr/bin/env node

import { log } from "console";
import { readFile, watchFile } from "fs";
import { transpile } from "typescript";

const args = process.argv.slice(2);
const mainFile = "main.ts";

init();

function init() {
  log("args", args);

  try {
    serve();
    watchFile(mainFile, { interval: 500 }, (current, previous) => {
      serve();
    });
  } catch (error) {
    log(error);
  }
}

function serve() {
  readFile(mainFile, { encoding: "utf-8" }, (fileError, source) => {
    const main = transpile(source);
    try {
      eval(main);
    } catch (evalError) {
      log(evalError);
    }
  });
}
