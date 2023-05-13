import { CssStyles, Html, HtmlAttributes } from "../models/html.model.js";

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
      // Layout
      case "cornerRadius":
        this.setStyle("border-radius", value);
        break;
      case "clipContent":
        this.setStyle("overflow", value ? "hidden" : "auto");
        break;
      case "direction":
        this.setStyle("flex-direction", value);
        break;
      // Style
      case "textColor":
        this.setStyle("color", value);
        break;
      case "font":
        this.setStyle("font-family", value);
        break;
      default:
        const cssName = name.replace(/([A-Z])/g, "-$1").toLowerCase();
        this.setStyle(cssName, value);
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
