#!/usr/bin/env node

import { spawn } from "child_process";
import { log } from "console";
import { watchFile } from "fs";
import * as path from "path";
import * as ts from "typescript";

const args = process.argv.slice(2);

const fileName = "main.ts";
const projectDirectory = process.cwd();
const srcDirectory = path.resolve(projectDirectory, "src");
const mainPath = path.resolve(srcDirectory, fileName);

init();

function init() {
  console.log("args", args);

  try {
    serve();
    watchFile(mainPath, { interval: 500 }, (current, previous) => {
      serve();
    });
  } catch (error) {
    console.log(error);
  }
}

function serve() {
  try {
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

    console.log("TypeScript compilation succeeded!");

    const outputPath = path.resolve(projectDirectory, ".proto/", "main.js");

    const ls = spawn("node", [outputPath]);

    ls.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    ls.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    ls.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
    });
  } catch (error) {
    log("err", error);
  }
}
