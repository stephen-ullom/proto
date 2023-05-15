import { Content } from "../models/html.model";
import { TextProperties } from "../models/properties.model";
import { HtmlElement } from "../scripts/html-element";

export function text(
  properties: TextProperties,
  ...children: Content[]
): Content {
  const element = new HtmlElement("span");
  element.setProperties(properties);
  element.setChildren(children);
  return element.render();
}
