import { expect, test, beforeEach } from 'vitest';
import { JsonVocabularyAdapter } from "./jsonld-adapter.tsx";
import { JsonVocabularyModel } from "./jsonld-model.tsx";
import { UniversalModel } from "../../data-model-api/index.ts";

let adapter: JsonVocabularyAdapter;
let mockJsonVocabularyModel: JsonVocabularyModel;
let mockMainModel: UniversalModel;

beforeEach(() => {
  adapter = new JsonVocabularyAdapter();
  mockJsonVocabularyModel = {
    "@context": "test-context",
    iri: "test-iri",
    typ: ["TestType"],
    název: { cs: "Test CS", en: "Test EN" },
    popis: { cs: "Test Popis CS", en: "Test Popis EN" },
    vytvořeno: { typ: "Časový okamžik", datum: "2025-01-01" },
    aktualizováno: { // Explicitly define the object for aktualizováno
      typ: "Časový okamžik",
      datum_a_čas: "2025-01-15T10:00:00+00:00"
    },
    extraProperty: "extraValue",
  };

  mockMainModel = {
    entities: [
      {
        label: "JSON Vocabulary Root",
        properties: [
          { label: "@context", type: {} },
          { label: "iri", type: {} },
          { label: "typ", type: {} },
          { label: "název", type: {} },
          { label: "popis", type: {} },
          { label: "vytvořeno", type: {} },
          { label: "aktualizováno", type: {} },
          { label: "extraProperty", type: {} },
        ],
      },
    ],
  };
});

test("should correctly adapt from JsonVocabularyModel to MainModel", async () => {
  const mainModel = await adapter.fromJsonVocabulary(mockJsonVocabularyModel);
  expect(mainModel.entities.length).toBe(1);
  expect(mainModel.entities[0].label).toBe("JSON Vocabulary Root");
  expect(mainModel.entities[0].properties.length).toBe(Object.keys(mockJsonVocabularyModel).length);
  expect(mainModel.entities[0].properties.find(p => p.label === "iri")?.label).toBe("iri");
});

test("should correctly adapt from MainModel to JsonVocabularyModel (basic)", async () => {
  const jsonVocabularyModel = await adapter.toJsonVocabulary(mockMainModel);
  expect(jsonVocabularyModel["@context"]).toBe("https://ofn.gov.cz/slovníky/draft/kontexty/slovníky.jsonld");
  expect(jsonVocabularyModel.iri).toBe("https://slovník.gov.cz/datový/turistické-cíle");
  // Note: This test only checks the hardcoded properties in the adapter.
  // A more comprehensive test would require a more sophisticated adapter.
});

// Add more tests to verify the adapter's behavior with different
// structures and data types in both models. For example:
// - Test handling of nested objects in JsonVocabularyModel.
// - Test how different 'type' definitions in MainModel properties
//   are handled during the conversion to JsonVocabularyModel.


test("Root can be an object.", () => { 
  const input = {
    type: "object",
    properties: {
      name: { type: "string" },
    },
  },
});