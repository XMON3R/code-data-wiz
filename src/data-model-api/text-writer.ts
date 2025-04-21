import { CommonModel } from "../common-model.tsx"

export interface TextWriter {
    write(model: CommonModel): Promise<string>;
  }
  