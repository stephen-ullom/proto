import { Content } from "../models/html.model";
import { StackProperties } from "../models/properties.model";
import { HtmlElement } from "../scripts/html-element";

export function layout(
  properties: StackProperties,
  ...children: Content[]
): Content {
  const element = new HtmlElement("div");
  element.setStyle("display", "flex");
  element.setStyle("flex-grow", "0");
  element.setStyle("flex-shrink", "0");
  element.setProperties(properties);
  element.setChildren(children);
  return element.render();
}
