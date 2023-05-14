import { Content } from "../models/html";
import { StackProperties } from "../models/properties";
import { HtmlElement } from "../scripts/html-element";

export function layout(
  properties: StackProperties,
  ...children: Content[]
): Content {
  const element = new HtmlElement("div");
  element.setStyle("display", "flex");
  element.setProperties(properties);
  element.setChildren(children);
  return element.render();
}
