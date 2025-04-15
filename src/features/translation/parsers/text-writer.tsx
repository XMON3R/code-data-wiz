import { CommonModel } from "../common-model/common-model";

export interface TextWriter {
    write(model: CommonModel): Promise<string>;
  }
  