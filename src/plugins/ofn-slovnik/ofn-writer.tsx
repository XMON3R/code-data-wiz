// plugins/json-vocabulary/json-vocabulary-writer.ts
import { DomainTextWriter } from "../../data-model-api/domain-specific-model-api";
import { OfnModel } from "./ofn-model";

export class OfnWriter implements DomainTextWriter<OfnModel> {
  async writeText(model: OfnModel): Promise<string> {
      try {
          return JSON.stringify(model, null, 2);
      } catch (error) {
          console.error("Error writing JSON:", error);
          throw new Error("Failed to write JSON");
      }
  }
}
