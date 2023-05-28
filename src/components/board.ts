import { Content, Html } from "../models/html.model";
import { BoardProperties } from "../models/properties.model";
import { Alignment, Direction } from "../models/property-values.model";
import { HtmlElement } from "../scripts/html-element";

let boardCount = 0;

export function board(
  properties: BoardProperties | Content,
  ...children: Content[]
): Html {
  boardCount++;
  const element = new HtmlElement("section");
  element.setAttribute("id", `board${boardCount}`);
  element.setStyle("position", "relative");
  element.setStyle("padding", "50px");
  element.setStyle("display", "flex");
  element.setStyle("flex-direction", Direction.Vertical);
  element.setStyle("align-items", Alignment.Center);

  if (typeof properties === "object") {
    const name = new HtmlElement("h1");
    name.setAttribute(
      "onclick",
      `event.preventDefault();zoomToBoard(${boardCount});`
    );
    name.setChildren([properties.name]);
    children.unshift(name.render());
  } else {
    children.unshift(properties);
  }
  element.setChildren(children);
  return element.render();
}
