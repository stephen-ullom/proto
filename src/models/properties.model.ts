export enum Direction {
  Vertical = "column",
  Horizontal = "row",
}

export enum Alignment {
  Start = "start",
  Center = "center",
  End = "end",
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
