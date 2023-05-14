import { CssStyles, Content, HtmlAttributes } from "../models/html";
import { Properties } from "../models/properties";
import { properties } from "./properties";

export class HtmlElement {
  public name: string;
  public styles: CssStyles = {};
  public children: Content[] = [];

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

  public setProperty(name: string, value: any): void {
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

  public setProperties(properties: Properties): void {
    for (const [key, value] of Object.entries(properties)) {
      this.setProperty(key, value);
    }
  }

  public setAttribute(name: string, value: string): void {
    this.attributes[name] = value;
  }

  public setChildren(children: Content[]) {
    for (const child of Object.values(children)) {
      this.children.push(child);
    }
  }

  public render(): Content {
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
