// plugins/json-vocabulary/json-vocabulary-parser.ts
import { TextParser } from "../../data-model-api/text-parser"
import { JsonldModel } from "./jsonld-model";

export class JsonVocabularyParser implements TextParser {
  async parse(text: string): Promise<JsonldModel> {
    try {
      const jsonData: JsonldModel = JSON.parse(text);
      return jsonData;
    } catch (error) {
      console.error("Error parsing JSON:", error);
      throw new Error("Failed to parse JSON");
    }
  }
}