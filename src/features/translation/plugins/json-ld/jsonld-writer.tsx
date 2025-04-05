import { VocabularyEntry } from "./jsonld-model";
import { TextWriter } from "../../parsers/text-writer"; // adjust path if needed

export class OfnWriter implements TextWriter {
  async parse(model: VocabularyEntry[]): Promise<string> {
    return JSON.stringify(model, null, 2); // Pretty print the JSON with 2 spaces
  }
}
