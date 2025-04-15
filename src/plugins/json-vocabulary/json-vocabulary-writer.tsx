// plugins/json-vocabulary/json-vocabulary-writer.ts
import { TextWriter } from "../../data-model-api/parsers/text-writer"
import { JsonVocabularyModel } from "./json-vocabulary-model";

export class JsonVocabularyWriter implements TextWriter {
  async write(model: JsonVocabularyModel): Promise<string> {
    try {
      return JSON.stringify(model, null, 2);
    } catch (error) {
      console.error("Error writing JSON:", error);
      throw new Error("Failed to write JSON");
    }
  }
}