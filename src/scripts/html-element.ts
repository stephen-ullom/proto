import { CssStyles, Html, HtmlAttributes } from "../models/html.model";

export class HtmlElement {
  public name: string;
  public styles: CssStyles = {};
  public children: Html[] = [];

  private attributes: HtmlAttributes = {};

  constructor(name?: string) {
    this.name = name;
  }

  public setStyle(name: string, value: string | number): void {
    if (Number.isInteger(value)) {
      this.styles[name] = value + "px";
    } else {
      this.styles[name] = value as string;
    }
  }

  public setAttribute(name: string, value: string): void {
    this.attributes[name] = value;
  }

  public render(): Html {
    let styleString = "";
    for (const [key, value] of Object.entries(this.styles)) {
      styleString += `${key}: ${value};`;
    }
    if (styleString) {
      this.attributes["style"] = styleString;
    }

    let attributes = "";
    for (const [key, value] of Object.entries(this.attributes)) {
      attributes += ` ${key}="${value}"`;
    }

    const content = this.children.join("");
    return `<${this.name}${attributes}>${content}</${this.name}>`;
  }
}
