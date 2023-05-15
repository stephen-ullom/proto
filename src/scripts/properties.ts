import { Properties, PropertyType } from "../models/properties.model";

export const properties: Properties = {
  // Layout
  padding: {
    name: "padding",
    type: PropertyType.Edges,
  },
  margin: {
    name: "margin",
    type: PropertyType.Edges,
  },
  position: {
    type: PropertyType.Position,
  },
  direction: {
    name: "flex-direction",
    type: PropertyType.Direction,
  },
  clipContent: {
    name: "overflow",
    type: PropertyType.Boolean,
    true: "hidden",
    false: "visible",
  },
  fillContainer: {
    name: "flex",
    type: PropertyType.Boolean,
    true: "auto",
    false: "none",
  },
  // Style
  font: {
    name: "font-family",
    type: PropertyType.String,
  },
  textColor: {
    name: "color",
    type: PropertyType.String,
  },
  cornerRadius: {
    name: "border-radius",
    type: PropertyType.Edges,
  },
  border: {
    type: PropertyType.Border,
  },
};
