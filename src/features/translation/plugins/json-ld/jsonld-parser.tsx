import { VocabularyEntry } from "./jsonld-model";
import { TextParser } from "../../parsers/text-parser"; // Adjust path if necessary


export class OfnParser implements TextParser {
  async parse(text: string): Promise<VocabularyEntry[]> {
    const data = JSON.parse(text);
    // Since we're expecting an array of VocabularyEntry
    return Array.isArray(data) ? data : [data]; // In case we get a single object, wrap it in an array
  }
}
