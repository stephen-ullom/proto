import { Html } from "../models/html.model";
import { BoardProperties } from "../models/properties.model";
import { HtmlElement } from "../scripts/html-element";

let boardCount = 0;

export function board(
  properties: BoardProperties | Html,
  ...children: Html[]
): Html {
  boardCount++;
  const boardId = `board${boardCount}`;
  const element = new HtmlElement("section");
  element.setAttribute("id", boardId);
  element.setStyle("position", "relative");
  element.setStyle("padding", "50px");

  if (typeof properties === "object") {
    const name = new HtmlElement("h1");
    name.setAttribute(
      "onclick",
      `event.preventDefault();zoomTo('${boardId}');`
    );
    name.setChildren([properties.name]);
    children.unshift(name.render());
  } else {
    children.unshift(properties);
  }
  element.setChildren(children);
  return element.render();
}
