export type Html = string;

export type Content = string | number;

export type Scene = {
  name: string;
  scene: () => Promise<string>;
};

export type CssStyles = {
  [property: string]: string;
};

export type HtmlAttributes = {
  [name: string]: string;
};
