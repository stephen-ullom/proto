import * as path from "path";
import * as fs from "fs";

import { Content } from "../models/html.model";

export function include(filePath: string): Content {
  const projectDirectory = path.dirname(process.argv[1]);
  const assetPath = path.join(projectDirectory, filePath);
  return fs.readFileSync(assetPath, { encoding: "utf-8" });
}
