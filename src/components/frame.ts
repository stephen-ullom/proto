import { Content } from "../models/html";
import { FrameProperties } from "../models/properties";
import { HtmlElement } from "../scripts/html-element";

export function frame(
  properties: FrameProperties,
  ...children: Content[]
): Content {
  const element = new HtmlElement("div");
  element.setStyle("position", "relative");
  element.setProperties(properties);
  element.setChildren(children);
  return element.render();
}
