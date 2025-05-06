import { UniversalModel } from "./universal-model.ts";

export interface TextWriter {
    write(model: UniversalModel): Promise<string>;
  }
  