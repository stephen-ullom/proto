import { Content } from "../models/html";

export function repeat(
  array: any[],
  callback: (value: any, index: number, array: any[]) => Content
) {
  return array.map(callback).join("");
}
