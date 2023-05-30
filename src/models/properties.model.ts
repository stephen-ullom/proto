import {
  Alignment,
  Direction,
  Justification,
  Position,
} from "./property-values.model.js";

export interface Property {
  type: PropertyType;
  style?: string;
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
  Corners,
  Direction,
  Alignment,
  Border,
  Constraint,
}

export type Value = number | string;

export interface Edges {
  top?: Value;
  right?: Value;
  bottom?: Value;
  left?: Value;
  vertical?: Value;
  horizontal?: Value;
}

export interface Corners {
  top?: Value;
  right?: Value;
  bottom?: Value;
  left?: Value;
  topLeft?: Value;
  topRight?: Value;
  bottomLeft?: Value;
  bottomRight?: Value;
}

export interface Border {
  width?: Edges;
  color?: Edges;
  style?: string | Edges;
}

export interface GeneralProperties {
  // Layout
  width?: Value;
  height?: Value;
  padding?: Value | Edges;
  margin?: Value | Edges;
  constraint?: Value | Edges;
  fillContainer?: boolean;
  position?: Position;
  // Style
  cornerRadius?: Value | Corners;
  border?: {
    width?: Value | Edges;
    color?: Value | Edges;
  };
  backgroundColor?: string;
  // Content
  clipContent?: boolean;
  justifyContent?: Alignment | Justification;
  alignContent?: Alignment;
  // Any
  [key: string]: any;
}

export interface TxtProperties {
  textColor?: string;
  font?: string;
  fontSize?: number;
  textAlign?: Alignment;
  lineHeight?: number | string;
}

export interface LayoutProperties {
  direction?: Direction;
  gap?: number;
}

export interface BoardProperties {
  name?: string;
}

export interface FrameProperties extends GeneralProperties, LayoutProperties {}

export interface TextProperties extends GeneralProperties, TxtProperties {}

export interface ImageProperties extends GeneralProperties {}

export interface IncludeProperties extends GeneralProperties, TxtProperties {}
