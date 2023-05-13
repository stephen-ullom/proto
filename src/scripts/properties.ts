import { Properties } from "../models/properties.model";
import { Direction } from "../models/property-values.model";

export const properties: Properties = {
  // Layout
  cornerRadius: {
    name: "border-radius",
    type: Number,
  },
  direction: {
    name: "flex-direction",
    type: Direction,
  },
  clipContent: {
    name: "overflow",
    type: Boolean,
    on: "hidden",
    off: "visible",
  },
  fillContainer: {
    name: "flex",
    type: Boolean,
    on: "auto",
    off: "none",
  },
  // Style
  font: {
    name: "font-family",
    type: String,
  },
  textColor: {
    name: "color",
    type: String,
  },
};
