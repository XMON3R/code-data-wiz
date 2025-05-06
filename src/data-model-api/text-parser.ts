import { UniversalModel } from "./universal-model.ts";  

//ASK
/*
export interface TextParser  {
    parse(text: string): Promise<UniversalModel>;
  }
  
  */

export interface TextParser<T = UniversalModel> {
    parse(text: string): Promise<T>;
  }
  