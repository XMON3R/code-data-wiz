import { CommonModel } from "./common-model";

export interface TextWriter {
    parse(model: CommonModel): Promise<string>;
  }
  