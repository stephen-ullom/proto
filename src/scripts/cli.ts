#!/usr/bin/env node

import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import * as fs from "fs";
import * as http from "http";
import { ServerResponse } from "http";
import * as path from "path";
import * as ts from "typescript";

const fileName = "main.ts";
const projectDirectory = process.cwd();
const srcDirectory = path.resolve(projectDirectory, "src");
const mainPath = path.resolve(srcDirectory, fileName);
const outputPath = path.resolve(projectDirectory, ".proto/", "main.js");

const port = 8000;

let childProcess: ChildProcessWithoutNullStreams;
let response: ServerResponse;

init();

function init() {
  startServer();
  run();
  fs.watchFile(mainPath, { interval: 500 }, (current, previous) => {
    console.log("main.ts change");
    run();
  });
}

function startServer() {
  const server = http.createServer((req, res) => {
    const url = req.url.split("?")[0];
    const filePath = path.join(
      __dirname,
      "../../public",
      url === "/" ? "index.html" : url
    );

    console.log({ filePath });

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        res.writeHead(404);
        res.end("File not found");
      } else {
        fs.readFile(filePath, (err, data) => {
          if (err) {
            res.writeHead(500);
            res.end("Internal server error");
          } else {
            const ext = path.extname(filePath);
            const contentType = getContentType(ext);
            res.writeHead(200, { "Content-Type": contentType });
            res.end(data);
          }
        });
      }
    });
  });

  server.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });

  // Helper function to get the content type based on the file extension
  function getContentType(ext) {
    switch (ext) {
      case ".html":
        return "text/html";
      case ".css":
        return "text/css";
      case ".js":
        return "text/javascript";
      case ".json":
        return "application/json";
      case ".png":
        return "image/png";
      case ".jpg":
      case ".jpeg":
        return "image/jpeg";
      default:
        return "application/octet-stream";
    }
  }
}

function run() {
  build();

  if (childProcess) {
    childProcess.kill();
  }

  childProcess = spawn("node", [outputPath]);

  childProcess.on("spawn", (data) => {
    response?.write("data: refresh\n\n");
  });

  childProcess.stdout.on("data", (data) => {
    console.log(String(data));
  });

  childProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  childProcess.on("close", (code) => {
    console.log(`Preview loading...`);
  });
}

function build() {
  const program = ts.createProgram({
    rootNames: [mainPath],
    options: {
      baseUrl: projectDirectory,
      rootDir: "src",
      outDir: ".proto",
      resolveJsonModule: true
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

  console.log("Build succeeded");
}
