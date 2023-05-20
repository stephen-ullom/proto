import { CssStyles, Content, HtmlAttributes } from "../models/html.model";
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

  public setStyle(cssProperty: string, value: string | number): void {
    if (Number.isInteger(value)) {
      this.styles[cssProperty] = value + "px";
    } else {
      this.styles[cssProperty] = value as string;
    }
  }

  public setProperties(properties: Properties): void {
    for (const [key, value] of Object.entries(properties)) {
      setProperty(this, key, value);
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

function setCorners(value: Corners, unit = "") {
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

function setProperty(element: HtmlElement, name: string, value: any): void {
  const property = properties[name];
  if (property) {
    switch (property.type) {
      case PropertyType.Boolean:
        element.setStyle(property.name, value ? property.true : property.false);
        break;
      case PropertyType.Edges:
        element.setStyle(
          property.name,
          typeof value === "object" ? setEdges(value, "px") : value
        );
        break;
      case PropertyType.Border:
        element.setStyle("border-style", "solid");
        const border = value as Border;
        if (border.width) {
          element.setStyle(
            "border-width",
            typeof border.width === "object"
              ? setEdges(border.width, "px")
              : border.width
          );
        }
        if (border.color) {
          element.setStyle(
            "border-color",
            typeof border.color === "object"
              ? setEdges(border.color)
              : border.color
          );
        }
        if (border.style) {
          element.setStyle(
            "border-style",
            typeof border.style === "object"
              ? setEdges(border.style)
              : border.style
          );
        }
        break;
      case PropertyType.Corners:
        element.setStyle(
          property.name,
          typeof value === "object" ? setCorners(value, "px") : value
        );
        break;
      case PropertyType.Constraint:
        element.setStyle("position", "absolute");
        const position = value as Edges;
        if (position.vertical !== undefined) {
          position.top = position.bottom = position.vertical;
        }
        if (position.horizontal !== undefined) {
          position.left = position.right = position.horizontal;
        }
        if (position.top !== undefined) {
          element.setStyle("top", position.top);
        }
        if (position.right !== undefined) {
          element.setStyle("right", position.right);
        }
        if (position.bottom !== undefined) {
          element.setStyle("bottom", position.bottom);
        }
        if (position.left !== undefined) {
          element.setStyle("left", position.left);
        }
        break;
      default:
        element.setStyle(property.name, value);
        break;
    }
  } else {
    const cssName = name.replace(/([A-Z])/g, "-$1").toLowerCase();
    element.setStyle(cssName, value);
  }
}
