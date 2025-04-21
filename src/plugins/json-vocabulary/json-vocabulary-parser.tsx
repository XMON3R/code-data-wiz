// plugins/json-vocabulary/json-vocabulary-parser.ts
import { TextParser } from "../../data-model-api/text-parser"
import { JsonVocabularyModel } from "./json-vocabulary-model";

export class JsonVocabularyParser implements TextParser {
  async parse(text: string): Promise<JsonVocabularyModel> {
    try {
      const jsonData: JsonVocabularyModel = JSON.parse(text);
      return jsonData;
    } catch (error) {
      console.error("Error parsing JSON:", error);
      throw new Error("Failed to parse JSON");
    }
  }
}