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
  watchBuild();
}

function startServer() {
  const server = http.createServer((req, res) => {
    const url = req.url.split("?")[0];
    const filePath = path.join(
      __dirname,
      "../../public",
      url === "/" ? "index.html" : url
    );

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

function watchBuild() {
  const compilierOptions = {
    baseUrl: projectDirectory,
    rootDir: "src",
    outDir: ".proto",
    resolveJsonModule: true,
  };

  const host = ts.createWatchCompilerHost(
    [mainPath],
    compilierOptions,
    ts.sys,
    ts.createSemanticDiagnosticsBuilderProgram,
    undefined,
    (diagnostic) => {
      const watchingCode = 6194;
      if (diagnostic.code === watchingCode) {
        run();
      }
    }
  );

  ts.createWatchProgram(host);
}

function run() {
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
