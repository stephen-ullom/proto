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

export interface ColorProperties {
  backgroundColor?: string;
  textColor?: string;
}

export interface TextProperties {
  font?: string;
  fontSize?: number;
  textAlign?: Alignment;
}

export interface BoxProperties {
  width?: number;
  height?: number;
  padding?: number | Sides;
  margin?: number;
  cornerRadius?: number;
  clipContent?: boolean;
  fillContainer?: boolean;
}

export interface FrameProperties extends BoxProperties, ColorProperties {
  direction?: Direction;
  gap?: number;
  justifyContent?: Alignment | Justification;
  alignItems?: Alignment;
}

export interface ImageProperties {
  [key: string]: any;
}
