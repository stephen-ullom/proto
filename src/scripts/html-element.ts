import { Content, CssStyles, Html, HtmlAttributes } from "../models/html.model";
import {
  Border,
  Corners,
  Edges,
  Properties,
  PropertyType,
} from "../models/properties.model";
import { properties } from "./properties";

export class HtmlElement {
  public name: string;
  public styles: CssStyles = {};
  public children: Content[] = [];

  private attributes: HtmlAttributes = {};

  constructor(name?: string) {
    this.name = name;
  }

  public setStyle(
    cssProperty: string,
    value: string | number,
    unit?: string
  ): void {
    if (unit && Number.isInteger(value)) {
      this.styles[cssProperty] = value + unit;
    } else {
      this.styles[cssProperty] = value as string;
    }
  }

  public setProperty(name: string, value: any): void {
    const property = properties[name];
    if (property) {
      const style =
        property.style || name.replace(/([A-Z])/g, "-$1").toLowerCase();
      switch (property.type) {
        case PropertyType.Boolean:
          this.setStyle(style, value ? property.true : property.false);
          break;
        case PropertyType.Number:
          this.setStyle(style, value);
          break;
        case PropertyType.Pixel:
          this.setStyle(style, value, "px");
          break;
        case PropertyType.Edges:
          this.setStyle(
            style,
            typeof value === "object" ? setEdges(value, "px") : value,
            "px"
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
                : border.width,
              "px"
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
        case PropertyType.Corners:
          this.setStyle(
            style,
            typeof value === "object" ? setCorners(value, "px") : value,
            "px"
          );
          break;
        case PropertyType.Constraint:
          this.setStyle("position", "absolute");
          let position: Edges;
          if (typeof value === "object") {
            position = value;
          } else {
            position = { vertical: value, horizontal: value };
          }
          if (position.vertical !== undefined) {
            position.top = position.bottom = position.vertical;
          }
          if (position.horizontal !== undefined) {
            position.left = position.right = position.horizontal;
          }
          if (position.top !== undefined) {
            this.setStyle("top", position.top, "px");
          }
          if (position.right !== undefined) {
            this.setStyle("right", position.right, "px");
          }
          if (position.bottom !== undefined) {
            this.setStyle("bottom", position.bottom, "px");
          }
          if (position.left !== undefined) {
            this.setStyle("left", position.left, "px");
          }
          break;
        default:
          this.setStyle(style, value);
          break;
      }
    } else {
      const cssName = name.replace(/([A-Z])/g, "-$1").toLowerCase();
      this.setStyle(cssName, value);
    }
  }

  public addProperties(properties: Properties): void {
    for (const [key, value] of Object.entries(properties)) {
      this.setProperty(key, value);
    }
  }

  public setAttribute(name: string, value: string): void {
    this.attributes[name] = value;
  }

  public setChildren(children: Content[]): void {
    for (const child of Object.values(children)) {
      this.children.push(child);
    }
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

function setEdges(value: Edges, unit = ""): string {
  const edges: Edges = { top: 0, right: 0, bottom: 0, left: 0 };

  if (value.vertical) {
    edges.top = edges.bottom = value.vertical;
  }
  if (value.horizontal) {
    edges.left = edges.right = value.horizontal;
  }
  Object.assign(edges, value);

  const edgeList = [edges.top, edges.right, edges.bottom, edges.left];
  return edgeList
    .map((item) => (Number.isInteger(item) ? item + unit : item))
    .join(" ");
}

function setCorners(value: Corners, unit = ""): string {
  const corners: Corners = {
    topLeft: 0,
    topRight: 0,
    bottomRight: 0,
    bottomLeft: 0,
  };

  if (value.top !== undefined) {
    corners.topLeft = corners.topRight = value.top;
  }
  if (value.right !== undefined) {
    corners.topRight = corners.bottomRight = value.right;
  }
  if (value.bottom !== undefined) {
    corners.bottomLeft = corners.bottomRight = value.bottom;
  }
  if (value.left !== undefined) {
    corners.topLeft = corners.bottomLeft = value.left;
  }
  Object.assign(corners, value);

  const cornerList = [
    corners.topLeft,
    corners.topRight,
    corners.bottomRight,
    corners.bottomLeft,
  ];
  return cornerList
    .map((corner) => (Number.isInteger(corner) ? corner + unit : corner))
    .join(" ");
}
