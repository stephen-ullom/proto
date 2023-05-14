import { CssStyles, Content, HtmlAttributes } from "../models/html";
import { Border, Edges, Properties, PropertyType } from "../models/properties";
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
      switch (property.type) {
        case PropertyType.Boolean:
          this.setStyle(property.name, value ? property.true : property.false);
          break;
        case PropertyType.Edges:
          this.setStyle(
            property.name,
            typeof value === "object" ? setEdges(value, "px") : value
          );
          break;
        case PropertyType.Border:
          this.setStyle("border-style", "solid");
          const border = value as Border;
          if (border.width) {
            this.setStyle(
              "border-width",
              typeof border.width === "object"
                ? setEdges(border.width, "px")
                : border.width
            );
          }
          if (border.color) {
            this.setStyle(
              "border-color",
              typeof border.color === "object"
                ? setEdges(border.color)
                : border.color
            );
          }
          if (border.style) {
            this.setStyle(
              "border-style",
              typeof border.style === "object"
                ? setEdges(border.style)
                : border.style
            );
          }
          break;
        default:
          this.setStyle(property.name, value);
          break;
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

function setEdges(value: Edges, unit?: string): string {
  const edges: Edges = { top: 0, right: 0, bottom: 0, left: 0 };
  if (value.vertical) {
    edges.top = edges.bottom = value.vertical;
  }
  if (value.horizontal) {
    edges.left = edges.right = value.horizontal;
  }
  Object.assign(edges, value);
  const list = [edges.top, edges.right, edges.bottom, edges.left];
  return list.map((item) => item + unit).join(" ");
}
