import { expect, test, describe } from "vitest";
import { OfnParser } from "./ofn-parser";
import { OfnModel } from "./ofn-model";

const parser = new OfnParser();

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

    // New tests for specific OFN rules
    test("should ignore concepts with 'Koncept' or 'Pojem' types unless they are also Class, Relation, or Property", async () => {
        const jsonString = `{
            "pojmy": [
                {
                    "iri": "http://example.com/concept1",
                    "typ": ["Koncept", "Pojem"],
                    "název": { "en": "Ignored Concept" }
                },
                {
                    "iri": "http://example.com/class1",
                    "typ": ["Třída", "Koncept"],
                    "název": { "en": "Class Concept" },
                    "nadřazená-třída": ["http://example.com/superClass"]
                },
                {
                    "iri": "http://example.com/relation1",
                    "typ": ["Vztah", "Pojem"],
                    "název": { "en": "Relation Concept" },
                    "definiční-obor": "http://example.com/domain",
                    "obor-hodnot": "http://example.com/range"
                }
            ]
        }`;

        const model: OfnModel = await parser.parseText(jsonString);
        const concepts = model.concepts || [];

        const ignoredConcept = concepts.find(c => c.iri === "http://example.com/concept1");
        expect(ignoredConcept?.ignored?.["Koncept/Pojem"]).toBe("Ignored as per OFN rules.");

        const classConcept = concepts.find(c => c.iri === "http://example.com/class1");
        expect(classConcept?.subClassOf).toEqual(["http://example.com/superClass"]);
        expect(classConcept?.ignored?.["Koncept/Pojem"]).toBeUndefined(); // Should not be marked as ignored

        const relationConcept = concepts.find(c => c.iri === "http://example.com/relation1");
        expect(relationConcept?.domain).toBe("http://example.com/domain");
        expect(relationConcept?.range).toBe("http://example.com/range");
        expect(relationConcept?.ignored?.["Koncept/Pojem"]).toBeUndefined(); // Should not be marked as ignored
    });

    test("should map 'nadřazená-třída' to 'subClassOf' for 'Třída' types", async () => {
        const jsonString = `{
            "pojmy": [
                {
                    "iri": "http://example.com/myClass",
                    "typ": ["Třída"],
                    "název": { "en": "My Class" },
                    "nadřazená-třída": ["http://example.com/superClass1", "http://example.com/superClass2"]
                }
            ]
        }`;

        const model: OfnModel = await parser.parseText(jsonString);
        const myClass = model.concepts?.find(c => c.iri === "http://example.com/myClass");
        expect(myClass?.subClassOf).toEqual(["http://example.com/superClass1", "http://example.com/superClass2"]);
    });

    test("should map 'definiční-obor' and 'obor-hodnot' to 'domain' and 'range' for 'Vztah' and 'Vlastnost' types", async () => {
        const jsonString = `{
            "pojmy": [
                {
                    "iri": "http://example.com/hasType",
                    "typ": ["Vztah"],
                    "název": { "en": "hasType" },
                    "definiční-obor": "http://example.com/domainForRelation",
                    "obor-hodnot": "http://example.com/rangeForRelation"
                },
                {
                    "iri": "http://example.com/isSmokingAllowed",
                    "typ": ["Vlastnost"],
                    "název": { "en": "isSmokingAllowed" },
                    "definiční-obor": "http://example.com/domainForProperty",
                    "obor-hodnot": "xsd:boolean"
                }
            ]
        }`;

        const model: OfnModel = await parser.parseText(jsonString);
        const hasType = model.concepts?.find(c => c.iri === "http://example.com/hasType");
        expect(hasType?.domain).toBe("http://example.com/domainForRelation");
        expect(hasType?.range).toBe("http://example.com/rangeForRelation");

        const isSmokingAllowed = model.concepts?.find(c => c.iri === "http://example.com/isSmokingAllowed");
        expect(isSmokingAllowed?.domain).toBe("http://example.com/domainForProperty");
        expect(isSmokingAllowed?.range).toBe("xsd:boolean");
    });

    test("should ignore 'nadřazený-vztah' and add a comment", async () => {
        const jsonString = `{
            "pojmy": [
                {
                    "iri": "http://example.com/someRelation",
                    "typ": ["Vztah"],
                    "název": { "en": "Some Relation" },
                    "nadřazený-vztah": ["http://example.com/superRelation"]
                }
            ]
        }`;

        const model: OfnModel = await parser.parseText(jsonString);
        const someRelation = model.concepts?.find(c => c.iri === "http://example.com/someRelation");
        expect(someRelation?.ignored?.["nadřazený-vztah"]).toBe("Ignored as per OFN rules.");
    });
});
