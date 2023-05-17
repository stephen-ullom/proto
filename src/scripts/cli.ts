#!/usr/bin/env node

import * as cp from "child_process";
import * as fs from "fs";
import * as http from "http";
import * as path from "path";

const projectDirectory = process.cwd();
const packageJsonPath = path.resolve(projectDirectory, "package.json");
const packageJson = require(packageJsonPath);
const port = 8000;

let timeoutId: NodeJS.Timeout;
let childProcess: cp.ChildProcessWithoutNullStreams;

startServer();
watchProject();

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

function watchProject() {
  run();
  fs.watch(projectDirectory, { recursive: true }, (eventType, filename) => {
    if (filename) {
      debounce(() => {
        console.log("Change detected...");
        run();
      }, 100);
    }
  });
}

function run() {
  if (childProcess) {
    childProcess.kill();
  }

  childProcess = cp.spawn("node", [packageJson.main], {
    stdio: "inherit",
    cwd: projectDirectory,
  });
}

function debounce(func, delay) {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(func, delay);
}
