import { Properties } from "../models/properties.model.js";
import { Direction } from "../models/property-values.model.js";

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
