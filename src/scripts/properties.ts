import { Properties } from "../models";
import { Direction } from "../models/property-values.model";

const properties: Properties = {
  cornerRadius: {
    cssProperty: "border-radius",
    type: Number,
  },
  direction: {
    cssProperty: "flex-direction",
    type: Direction,
  },
  clipContent: {
    cssProperty: "overflow",
    type: Boolean,
  },
};
