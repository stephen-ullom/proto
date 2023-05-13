import { CssStyles, Html, HtmlAttributes } from "../models/html.model";
import { properties } from "./properties";

export class HtmlElement {
  public name: string;
  public styles: CssStyles = {};
  public children: Html[] = [];

  private attributes: HtmlAttributes = {};

  constructor(name?: string) {
    this.name = name;
  }

  public setStyle(cssProperty: string, value: string | number): void {
    if (Number.isInteger(value)) {
      this.styles[cssProperty] = value + "px";
    } else {
      this.styles[cssProperty] = value as string;
    }
  }

  public setProperty(name: string, value: any) {
    const property = properties[name];
    if (property) {
      if (property.type === Boolean) {
        this.setStyle(property.name, value ? property.on : property.off);
      } else {
        this.setStyle(property.name, value);
      }
    } else {
      const cssName = name.replace(/([A-Z])/g, "-$1").toLowerCase();
      this.setStyle(cssName, value);
    }
  }

  public setAttribute(name: string, value: string): void {
    this.attributes[name] = value;
  }

  public render(): Html {
    let styleString = "";
    for (const [key, value] of Object.entries(this.styles)) {
      styleString += `${key}:${value};`;
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
