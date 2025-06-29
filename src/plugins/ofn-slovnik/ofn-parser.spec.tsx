import { expect, test, describe } from "vitest";
import { OfnParser } from "./ofn-parser";
import { OfnModel } from "./ofn-model";

const parser = new OfnParser();

// Corrected the describe block name to match the component being tested
describe("OfnParser", () => {
    
    test("should successfully parse and map a valid OFN JSON string", async () => {
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
            "en": "Vocabulary of tourist points of interest serves as an example"
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
        
        const model: OfnModel = await parser.parseText(jsonString);

        // Verify that the properties were correctly mapped to the OfnModel interface
        expect((model as any)["@context"]).toBe("https://ofn.gov.cz/slovníky/draft/kontexty/slovníky.jsonld");
        expect(model.iri).toBe("https://slovník.gov.cz/datový/turistické-cíle");
        expect(model.name.cs).toBe("Slovník turistických cílů");
        expect(model.description.en).toBe("Vocabulary of tourist points of interest serves as an example");
        expect(model.createdAt).toBe("2024-01-01");
        expect(model.updatedAt).toBe("2024-01-15T04:53:21+02:00");
    });
      
    test("should throw an error for invalid JSON", async () => {
        const invalidJsonString = `{"invalid": "json"`;
        // Check that parsing invalid JSON rejects with the expected error
        await expect(parser.parseText(invalidJsonString)).rejects.toThrowError("Failed to parse OFN JSON");
    });

    test("should handle missing optional fields gracefully", async () => {
        const jsonString = `{
            "název": { "cs": "Chybějící pole" },
            "popis": { "cs": "Tento objekt nemá IRI ani časové údaje." }
        }`;

        const model: OfnModel = await parser.parseText(jsonString);
        expect(model.name.cs).toBe("Chybějící pole");
        expect(model.iri).toBeUndefined();
        expect(model.createdAt).toBeUndefined();
        expect(model.updatedAt).toBeUndefined();
    });
});