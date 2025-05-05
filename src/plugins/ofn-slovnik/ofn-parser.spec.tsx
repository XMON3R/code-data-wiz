import { expect, test, describe } from "vitest";
import { JsonVocabularyParser } from "./ofn-parser";

// Instance of JsonVocabularyParser
const parser = new JsonVocabularyParser();

describe("JsonVocabularyParser", ( ) => {
    test("should successfully parse a valid JSON vocabulary string", async () => {
        const jsonString = `{
          "@context": "https://ofn.gov.cz/slovníky/draft/kontexty/slovníky.jsonld",
          "iri": "https://slovník.gov.cz/datový/turistické-cíle",
          "typ": ["Slovník"],
          "název": {
            "cs": "Slovník turistických cílů",
            "en": "Vocabulary of tourist points of interest"
          },
          "popis": {
            "cs": "Slovník turistických cílů slouží v rámci příkladu pro OFN Slovníky",
            "en": "Vocabulary of tourist points of interest serves as an example in the formal open standard for vocabularies"
          },
          "vytvořeno": {
            "typ": "Časový okamžik",
            "datum": "2024-01-01"
          },
          "aktualizováno": {
            "typ": "Časový okamžik",
            "datum_a_čas": "2024-01-15T04:53:21+02:00"
          }
        }`;
        const model = await parser.parse(jsonString);
        expect(model["@context"]).toBe("https://ofn.gov.cz/slovníky/draft/kontexty/slovníky.jsonld");
        expect(model.iri).toBe("https://slovník.gov.cz/datový/turistické-cíle");
        expect(model.název.cs).toBe("Slovník turistických cílů");
      });
      
      test("should throw an error for invalid JSON", async () => {
          const invalidJsonString = `{"invalid": "json"`; // Missing closing "}"
          await expect(parser.parse(invalidJsonString)).rejects.toThrowError("Failed to parse JSON");
        });
})
