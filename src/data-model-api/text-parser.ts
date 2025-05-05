import { UniversalModel } from "./index.ts";  // IMPORT PŘÍMO ZE SOUBORU 

export interface TextParser /* <T extends DomainSpecificModel> */ {

    parse(text: string): Promise<UniversalModel>;

  }
  