import { Content } from "../models/html.model";
import { BoardProperties } from "../models/properties.model";
import { HtmlElement } from "../scripts/html-element";

let boardCount = 0;

export function board(
  properties: BoardProperties,
  ...children: Content[]
): Content {
  boardCount++;
  const boardId = `board${boardCount}`;

  const text = new HtmlElement("h1");
  text.setAttribute("onclick", `zoomTo('${boardId}')`);
  text.setChildren([properties.name]);

  const element = new HtmlElement("section");
  element.setStyle("position", "relative");
  element.setAttribute("id", boardId);
  element.setChildren([text.render(), ...children]);
  return element.render();
}
