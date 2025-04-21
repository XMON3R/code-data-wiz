import { CommonModel } from "./common-model.tsx"

export interface TextParser /* <T extends DomainSpecificModel> */ {

    parse(text: string): Promise<CommonModel>;

  }
  