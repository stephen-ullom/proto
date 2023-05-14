import { Alignment, Direction, Justification } from "./property-values.js";

export interface Property {
  name: string;
  type: PropertyType;
  true?: string;
  false?: string;
}

export interface Properties {
  [property: string]: Property;
}

export enum PropertyType {
  String,
  Number,
  Pixel,
  Boolean,
  Edges,
  Direction,
  Alignment,
  Border,
}

// export interface ColorProperties {
//   backgroundColor?: string;
//   textColor?: string;
// }

// export interface BoxProperties {
//   width?: number;
//   height?: number;
//   clipContent?: boolean;
//   fillContainer?: boolean;
// }

// export interface FrameProperties extends BoxProperties, ColorProperties {
//   direction?: Direction;
//   gap?: number;
//   justifyContent?: Alignment | Justification;
//   alignItems?: Alignment;
//   cornerRadius?: number;
//   margin?: number;
//   padding?: number | Sides;
// }

// export interface TextProperties {
//   font?: string;
//   fontSize?: number;
//   textAlign?: Alignment;
// }

// export interface ImageProperties {
//   [key: string]: any;
// }

export type Value = number | string;

export interface Edges {
  top?: Value;
  right?: Value;
  bottom?: Value;
  left?: Value;
  vertical?: Value;
  horizontal?: Value;
}

export interface Border {
  width?: Edges;
  color?: Edges;
  style?: string | Edges;
}

export interface AllProperties {
  // Layout
  width?: number;
  height?: number;
  padding?: Value | Edges;
  margin?: Value | Edges;
  fillContainer?: boolean;
  // Style
  cornerRadius?: number;
  border?: {
    width?: Value | Edges;
    color?: Value | Edges;
  };
  // Content
  clipContent?: boolean;
  direction?: Direction;
  gap?: number;
  justifyContent?: Alignment | Justification;
  alignItems?: Alignment;
  // Color
  backgroundColor?: string;
  // Text
  textColor?: string;
  font?: string;
  fontSize?: number;
  textAlign?: Alignment;
  lineHeight?: number | string;
  // Any
  [key: string]: any;
}

export interface FrameProperties extends AllProperties {}

export interface StackProperties extends AllProperties {}

export interface TextProperties extends AllProperties {}

export interface ImageProperties extends AllProperties {}

export interface IncludeProperties extends AllProperties {}
