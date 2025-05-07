import { DomainSpecificModel } from "./domain-specific-model.ts";

export interface TextParser<T extends DomainSpecificModel> {
    parseText(text: string): Promise<T>;
  }
  
