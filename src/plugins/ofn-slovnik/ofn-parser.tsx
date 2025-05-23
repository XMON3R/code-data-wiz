// plugins/json-vocabulary/json-vocabulary-parser.ts
import { TextParser } from "../../data-model-api/text-parser"
import { OfnModel } from "./ofn-model";

// TODO: A lot of code from adapter will come here, do slowly step by step 
export class OfnParser implements TextParser<OfnModel> {
  async parse(text: string): Promise<OfnModel> {
      try {
          const ofnJsonData: OfnModel = JSON.parse(text);
          return ofnJsonData;
      } catch (error) {
          console.error("Error parsing OFN JSON:", error);
          throw new Error("Failed to parse OFN JSON");
      }
  }
}
