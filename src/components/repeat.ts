import { Html } from "../models/html.model";

export function repeat(
  array: any[],
  callback: (value: any, index: number, array: any[]) => Html
): Html {
  return array.map(callback).join("");
}
