// plugins/json-vocabulary/json-vocabulary-writer.ts
import { TextWriter } from "../../data-model-api/text-writer";
import { OfnModel } from "./ofn-model";

export class OfnWriter implements TextWriter<OfnModel> {
  async write(model: OfnModel): Promise<string> {
      try {
          return JSON.stringify(model, null, 2);
      } catch (error) {
          console.error("Error writing JSON:", error);
          throw new Error("Failed to write JSON");
      }
  }
}
