#!/usr/bin/env node

import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import * as fs from "fs";
import * as http from "http";
import { Server, ServerResponse } from "http";
import * as path from "path";
import * as ts from "typescript";

// const args = process.argv.slice(2);

const fileName = "main.ts";
const projectDirectory = process.cwd();
const srcDirectory = path.resolve(projectDirectory, "src");
const mainPath = path.resolve(srcDirectory, fileName);
const outputPath = path.resolve(projectDirectory, ".proto/", "main.js");
const port = 2000;

let childProcess: ChildProcessWithoutNullStreams;
let server: Server;
let response: ServerResponse;

init();

function init() {
  startServer();
  serve();
  fs.watchFile(mainPath, { interval: 500 }, (current, previous) => {
    console.log("main.ts change");
    serve();
  });
}

function startServer() {
  server = http.createServer((req, res) => {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });
    response = res;
    // res.write("data: null");
    // setInterval(() => {
    //   // Send a message to the client every 5 seconds
    //   res.write('data: refresh\n\n');
    // }, 5000);
  });
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

function serve() {
  build();

  if (childProcess) {
    console.log("Restarting server...");
    childProcess.kill();
  }

  childProcess = spawn("node", [outputPath]);

  childProcess.on("spawn", (data) => {
    console.log("spawn");
    response?.write("data: refresh\n\n");
  });

  childProcess.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  childProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  childProcess.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

function build() {
  const program = ts.createProgram({
    rootNames: [mainPath],
    options: {
      baseUrl: projectDirectory,
      rootDir: "src",
      outDir: ".proto",
    },
  });

  // Check that there are files to emit
  if (program.getSourceFiles().length === 0) {
    console.error("No files to emit");
    process.exit(1);
  }

  // Check for compilation errors
  const preEmitDiagnostics = ts.getPreEmitDiagnostics(program);
  if (preEmitDiagnostics.length > 0) {
    const formatHost = {
      getCanonicalFileName: (fileName) => fileName,
      getCurrentDirectory: ts.sys.getCurrentDirectory,
      getNewLine: () => ts.sys.newLine,
    };
    console.error(
      ts.formatDiagnosticsWithColorAndContext(preEmitDiagnostics, formatHost)
    );
    process.exit(1);
  }

  // Emit the files
  const emitResult = program.emit();
  const emitDiagnostics = emitResult.diagnostics;
  if (emitDiagnostics.length > 0) {
    const formatHost = {
      getCanonicalFileName: (fileName) => fileName,
      getCurrentDirectory: ts.sys.getCurrentDirectory,
      getNewLine: () => ts.sys.newLine,
    };
    console.error(
      ts.formatDiagnosticsWithColorAndContext(emitDiagnostics, formatHost)
    );
    process.exit(1);
  }

  console.log("Compilation succeeded");
}
