import { Content } from "../models/html.model";
import { ImageProperties } from "../models/properties.model";
import { HtmlElement } from "../scripts/html-element";

export function image(properties: ImageProperties, source: string): Content {
  const element = new HtmlElement("img");
  element.setProperties(properties);
  element.setAttribute("src", source);
  return element.render();
}
