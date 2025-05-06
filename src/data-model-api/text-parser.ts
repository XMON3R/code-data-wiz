import { UniversalModel } from "./universal-model.ts";  

export interface TextParser {
    parse(text: string): Promise<UniversalModel>;
  }
  