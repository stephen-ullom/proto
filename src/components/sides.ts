import { Sides } from "../models/html";

export function sides(
  top: number,
  right: number,
  bottom: number,
  left: number
): Sides {
  return [top, right, bottom, left].map((value) => value + "px").join(" ");
}
