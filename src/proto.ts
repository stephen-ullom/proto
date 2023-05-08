import { readFile, readFileSync, writeFile } from "fs";
import { HtmlElement } from "./xml-element";
import {
  FrameProperties,
  Html,
  TextProperties,
  ImageProperties,
} from "./models/properties.model";

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

export function text(...parameters: (TextProperties | string)[]) {
  const element = new HtmlElement("p");
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

export function repeat(
  array: any[],
  callback: (value: any, index: number, array: any[]) => Html
) {
  return array.map(callback).join("");
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

export function render(...content: Html[]) {
  readFile("template.html", { encoding: "utf-8" }, (error, template) => {
    const html = template.replace("{content}", content.join(""));
    writeFile("index.html", html, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log(html);
      }
    });
  });
}
