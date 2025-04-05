import { CommonModel } from "./common-model";

export interface TextParser {
    parse(text: string): Promise<CommonModel>;
  }
  