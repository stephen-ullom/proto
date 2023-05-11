import { CssStyles, Html, HtmlAttributes } from "../models/html.model";

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
    switch (name) {
      case "cornerRadius":
        this.setStyle("border-radus", value);
        break;
      case "clipContent":
        this.setStyle("overflow", value ? "hidden" : "auto");
        break;
      case "direction":
        this.setStyle("flex-direction", value);
        break;
      default:
        this.setStyle(name, value);
        break;
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
