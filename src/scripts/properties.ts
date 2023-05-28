import { Properties, PropertyType } from "../models/properties.model";

export const properties: Properties = {
  // Frame
  width: {
    type: PropertyType.Pixel,
  },
  height: {
    type: PropertyType.Pixel,
  },
  padding: {
    type: PropertyType.Edges,
  },
  margin: {
    type: PropertyType.Edges,
  },
  constraint: {
    type: PropertyType.Constraint,
  },
  fillContainer: {
    style: "flex",
    type: PropertyType.Boolean,
    true: "auto",
    false: "none",
  },
  // Layout
  direction: {
    style: "flex-direction",
    type: PropertyType.Direction,
  },
  alignContent: {
    style: "align-items",
    type: PropertyType.Alignment,
  },
  gap: {
    type: PropertyType.Pixel,
  },
  // Content
  clipContent: {
    style: "overflow",
    type: PropertyType.Boolean,
    true: "hidden",
    false: "visible",
  },
  // Style
  cornerRadius: {
    style: "border-radius",
    type: PropertyType.Corners,
  },
  border: {
    type: PropertyType.Border,
  },
  zIndex: {
    type: PropertyType.Number,
  },
  // Text
  font: {
    style: "font-family",
    type: PropertyType.String,
  },
  fontSize: {
    type: PropertyType.Pixel,
  },
  textColor: {
    style: "color",
    type: PropertyType.String,
  },
  textIndent: {
    type: PropertyType.Pixel,
  },
};
