import { CommonModel } from "../common-model/common-model.tsx"

export interface TextParser {
    parse(text: string): Promise<CommonModel>;
  }
  