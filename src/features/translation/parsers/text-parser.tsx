import { CommonModel } from "../common-model/common-model";

export interface TextParser {
    parse(text: string): Promise<CommonModel>;
  }
  