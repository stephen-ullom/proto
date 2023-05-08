export type Html = string;

export type CssStyles = {
  [property: string]: string;
};

export type HtmlAttributes = {
  [name: string]: string;
};

export enum Direction {
  Vertical = "column",
  Horizontal = "row",
}

export interface FrameProperties {
  // flow?: Direction;
  // cornerRadius?: number;
  // background?: string;
  [key: string]: any;
}

export interface TextProperties {
  [key: string]: any;
}

export interface ImageProperties {
  [key: string]: any;
}
