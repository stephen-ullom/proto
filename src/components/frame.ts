import { Content, Html } from "../models/html.model";
import { FrameProperties } from "../models/properties.model";
import { Alignment } from "../models/property-values.model";
import { HtmlElement } from "../scripts/html-element";

export function frame(
  properties: FrameProperties | Content,
  ...children: Content[]
): Html {
  const element = new HtmlElement("div");
  element.setStyle("display", "flex");
  element.setStyle("flex-grow", "0");
  element.setStyle("flex-shrink", "0");
  element.setStyle("align-items", Alignment.Start);

  if (typeof properties === "object") {
    element.addProperties(properties);
  } else {
    children.unshift(properties);
  }
  element.setChildren(children);
  return element.render();
}
