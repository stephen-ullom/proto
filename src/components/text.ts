import { Html } from "../models/html.model";
import { TextProperties } from "../models/properties.model";
import { HtmlElement } from "../scripts/html-element";

export function text(
  properties: TextProperties | Html,
  ...children: Html[]
): Html {
  const element = new HtmlElement("span");
  if (typeof properties === "object") {
    element.addProperties(properties);
  } else {
    children.unshift(properties);
  }
  element.setChildren(children);
  return element.render();
}
