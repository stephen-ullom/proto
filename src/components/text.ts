import { Content, Html } from "../models/html.model";
import { TextProperties } from "../models/properties.model";
import { HtmlElement } from "../scripts/html-element";

export function text(
  properties: TextProperties | Content,
  ...content: Content[]
): Html {
  const element = new HtmlElement("span");
  if (typeof properties === "object") {
    element.addProperties(properties);
  } else {
    content.unshift(properties);
  }
  element.setChildren(content);
  return element.render();
}
