import * as path from "node:path";
// import * as fs from "fs";

import { Html } from "../models/html.model";

export async function include(filePath: string): Promise<Html> {
  const projectDirectory = path.dirname(process.argv[1]);
  const assetPath = path.join(projectDirectory, filePath);
  // return fs.readFileSync(assetPath, { encoding: "utf-8" });

  return await Bun.file(assetPath).text();
}
