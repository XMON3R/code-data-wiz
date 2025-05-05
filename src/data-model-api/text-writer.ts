import { UniversalModel } from "./index.ts";

export interface TextWriter {
    write(model: UniversalModel): Promise<string>;
  }
  