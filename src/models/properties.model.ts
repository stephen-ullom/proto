import { Sides } from "./html.model.js";
import {
  Alignment,
  Direction,
  Justification,
} from "./property-values.model.js";

export interface Property {
  name: string;
  type: any;
  on?: string;
  off?: string;
}

export interface Properties {
  [property: string]: Property;
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

export interface AllProperties {
  // Layout
  width?: number;
  height?: number;
  padding?: number | Sides;
  margin?: number;
  fillContainer?: boolean;
  // Style
  cornerRadius?: number;
  // borderColor?:
  // Content
  clipContent?: boolean;
  direction?: Direction;
  gap?: number;
  justifyContent?: Alignment | Justification;
  alignItems?: Alignment;
  // Color
  backgroundColor?: string;
  textColor?: string;
  // Font
  font?: string;
  fontSize?: number;
  textAlign?: Alignment;
  // Any
  [key: string]: any;
}

export interface FrameProperties extends AllProperties {}

export interface TextProperties extends AllProperties {}

export interface IncludeProperties extends AllProperties {}
