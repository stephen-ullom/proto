# proto

Instantly create interactive UI prototypes with JavaScript.

Properties:

## stack/frame

- Direction
  - Horizontal (default)
  - Vertical
- BorderWidth
  - number
- Background
  - string

```ts
  // Layout
  width?: Value;
  height?: Value;
  padding?: Value | Edges;
  margin?: Value | Edges;
  constraint?: Edges;
  fillContainer?: boolean;
  // Style
  cornerRadius?: Value | Corners;
  border?: {
    width?: Value | Edges;
    color?: Value | Edges;
  };
  // Content
  clipContent?: boolean;
  direction?: Direction;
  gap?: number;
  justifyContent?: Alignment | Justification;
  alignContent?: Alignment;
  // Color
  backgroundColor?: string;
  // Text
  textColor?: string;
  font?: string;
  fontSize?: number;
  textAlign?: Alignment;
  lineHeight?: number | string;
```