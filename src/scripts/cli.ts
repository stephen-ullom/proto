#!/usr/bin/env node

import cp = require("child_process");
import fs = require("fs");
import http = require("http");
import path = require("path");
import ts = require("typescript");

const outFolder = ".proto";
const sourceFolder = "source";

const projectDirectory = process.cwd();
const sourceDirectory = path.join(projectDirectory, sourceFolder);

const packageJsonPath = path.resolve(projectDirectory, "package.json");
const packageJson = require(packageJsonPath);

const port = 8000;

const mainPath = packageJson.main;

let timeoutId: NodeJS.Timeout;
let childProcess: cp.ChildProcessWithoutNullStreams;

startServer();
watchProject();

function startServer(): void {
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

  function getContentType(ext: string): string {
    switch (ext.toLowerCase()) {
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

function watchProject(): void {
  build();
  console.log("Watching for changes...\n");

  fs.watch(sourceDirectory, { recursive: true }, (eventType, filename) => {
    if (filename) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        console.log("Change detected...");
        build();
      }, 100);
    }
  });
}

function build() {
  const tsconfig = path.join(projectDirectory, "tsconfig.json");

  const configFile = ts.readConfigFile(tsconfig, ts.sys.readFile);
  const compilerOptions = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    projectDirectory,
    { outDir: outFolder }
  ).options;

  const program = ts.createProgram([mainPath], compilerOptions);

  const emitResult = program.emit();

  const diagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  if (diagnostics.length) {
    console.error("TypeScript compilation errors:");
    diagnostics.forEach((diagnostic) => {
      const message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n"
      );
      console.error(
        `${diagnostic.file.fileName} (${diagnostic.start}): ${message}`
      );
    });
  } else {
    run();
  }
}

function run(): void {
  if (childProcess) {
    childProcess.kill();
  }

  const mainFile = path.parse(mainPath).name + ".js";
  childProcess = cp.spawn("node", [path.join(outFolder, mainFile)], {
    stdio: "inherit",
    cwd: projectDirectory,
  });
}
