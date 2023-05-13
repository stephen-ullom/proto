import { readFile, readFileSync } from "fs";
import { Server, createServer } from "http";
import { join } from "path";
import { Html, Sides } from "../models/html.model.js";
import {
  FrameProperties,
  ImageProperties,
  TextProperties,
} from "../models/properties.model.js";
import { HtmlElement } from "./html-element.js";

const hostname = "localhost";
const port = 8000;

let server: Server;

export function frame(...parameters: (FrameProperties | Html)[]): string {
  const element = new HtmlElement("div");
  const firstChild = parameters[0];

  element.setStyle("display", "flex");

  if (typeof firstChild === "object") {
    const properties = parameters.shift() as FrameProperties;
    for (const [key, value] of Object.entries(properties)) {
      element.setStyle(key, value);
    }
  }
  for (const value of Object.values(parameters)) {
    const html = value as Html;
    element.children.push(html);
  }
  return element.render();
}

export function text(...parameters: (TextProperties | string)[]): Html {
  const element = new HtmlElement("span");
  const firstChild = parameters[0];

  if (typeof firstChild === "object") {
    const properties = parameters.shift() as TextProperties;
    for (const [key, value] of Object.entries(properties)) {
      element.setStyle(key, value);
    }
  }
  for (const value of Object.values(parameters)) {
    const html = value as Html;
    element.children.push(html);
  }
  return element.render();
}

export function image(...parameters: (ImageProperties | string)[]) {
  const element = new HtmlElement("img");
  const firstChild = parameters[0];

  if (typeof firstChild === "object") {
    const properties = parameters.shift() as ImageProperties;
    for (const [key, value] of Object.entries(properties)) {
      element.setStyle(key, value);
    }
  }
  for (const value of Object.values(parameters)) {
    const source = value as string;
    element.setAttribute("src", source);
  }
  return element.render();
}

export function include(...parameters: (ImageProperties | string)[]) {
  const element = new HtmlElement("div");
  const firstChild = parameters[0];

  if (typeof firstChild === "object") {
    const properties = parameters.shift() as ImageProperties;
    for (const [key, value] of Object.entries(properties)) {
      element.setStyle(key, value);
    }
  }

  const path = parameters[0] as string;
  const file = readFileSync(path, { encoding: "utf-8" });
  element.children.push(file);
  return element.render();
}

export function repeat(
  array: any[],
  callback: (value: any, index: number, array: any[]) => Html
) {
  return array.map(callback).join("");
}

export function render(...content: Html[]) {
  const templatePath = join(__dirname, "../templates/default.html");
  readFile(templatePath, { encoding: "utf-8" }, (error, template) => {
    const html = template.replace("{content}", content.join(""));
    if (server) {
      console.log("Restarting server...");
      server.close();
    }
    server = createServer((req, res) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
    });
    server.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });
  });
}

export function sides(
  top: number,
  right: number,
  bottom: number,
  left: number
): Sides {
  return [top, right, bottom, left].join(" ");
}
