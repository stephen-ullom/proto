import * as fs from "fs";
import * as http from "http";
import * as path from "path";
import { Html, Sides } from "../models/html.model.js";
import {
  FrameProperties,
  ImageProperties,
  TextProperties,
} from "../models/properties.model.js";
import { HtmlElement } from "./html-element.js";

const port = 2000;
const projectDirectory = path.dirname(process.argv[1]);

export function frame(...parameters: (FrameProperties | Html)[]): string {
  const element = new HtmlElement("div");
  const firstChild = parameters[0];

  element.setStyle("display", "flex");

  if (typeof firstChild === "object") {
    const properties = parameters.shift() as FrameProperties;
    for (const [key, value] of Object.entries(properties)) {
      element.setProperty(key, value);
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
      element.setProperty(key, value);
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
      element.setProperty(key, value);
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
      element.setProperty(key, value);
    }
  }

  const assetName = parameters[0] as string;
  const assetPath = path.join(projectDirectory, assetName);
  console.log(assetPath);
  const file = fs.readFileSync(assetPath, { encoding: "utf-8" });
  const html = file.replace(/\n/g, "");
  element.children.push(html);
  return element.render();
}

export function repeat(
  array: any[],
  callback: (value: any, index: number, array: any[]) => Html
) {
  return array.map(callback).join("");
}

export function render(...content: Html[]) {
  const server = http.createServer((req, res) => {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });
    res.write(`data: ${content.join("")}\n\n`);
  });
  server.listen(port, () => {
    console.log(`Preview updated`);
  });
}

export function sides(
  top: number,
  right: number,
  bottom: number,
  left: number
): Sides {
  return [top, right, bottom, left].map((value) => value + "px").join(" ");
}
