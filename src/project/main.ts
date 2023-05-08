import { Direction } from "../models/properties.model";
import { frame, include, render, repeat, text } from "../proto";

const books = ["Mathew", "Mark", "Luke", "John"];

function header() {
  return frame(
    {
      background: "black",
      color: "white",
    },
    text({ flex: "1", "text-align": "center" }, "Header")
  );
}

function tabView() {
  return frame(
    {
      "flex-direction": Direction.Horizontal,
      "justify-content": "space-around",
      "align-items": "center",
      height: 64,
      background: "black",
      padding: 16,
      "padding-top": 0,
    },
    icon("book"),
    icon("bookmark"),
    icon("highlight"),
    icon("profile")
  );
}

function icon(name: string) {
  const imageSize = 32;
  return include(
    {
      width: imageSize,
      height: imageSize,
      fill: "white",
    },
    `src/project/icons/${name}.svg`
  );
}

render(
  frame(
    {
      width: 360,
      height: 800,
      background: "lightgray",
      "flex-direction": Direction.Vertical,
      "border-radius": 48,
      overflow: "hidden",
    },
    header(),
    frame(
      {
        "flex-direction": Direction.Vertical,
        flex: "1",
      },
      repeat(books, (book) => text(book))
    ),
    tabView()
  ),
  frame(
    {
      width: 360,
      height: 640,
      background: "lightgray",
      "flex-direction": Direction.Vertical,
      "border-radius": 16,
      overflow: "hidden",
    },
    header(),
    frame(
      {
        "flex-direction": Direction.Vertical,
        flex: "1",
      },
      repeat(books, (book) => text(book))
    ),
    tabView()
  )
);
