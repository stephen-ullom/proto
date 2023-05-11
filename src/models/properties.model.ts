import { Sides } from "./html.model";
import { Alignment, Direction, Justification } from "./property-values.model";

export interface ColorProperties {
  backgroundColor?: string;
  textColor?: string;
}

export interface BoxProperties {
  width?: number;
  height?: number;
  cornerRadius?: number;
  clipContent?: boolean;
  padding?: number | Sides;
  margin?: number;
  fitContent?: boolean;
}

export interface FrameProperties extends BoxProperties, ColorProperties {
  direction?: Direction;
  gap?: number;
  justifyContent: Alignment | Justification;
  alignItems: Alignment;
  font?: string;
}

export interface TextProperties {
  [key: string]: any;
}

export interface ImageProperties {
  [key: string]: any;
}

export interface Property {
  cssProperty: string;
  type: any;
}

export interface Properties {
  [property: string]: Property;
}
