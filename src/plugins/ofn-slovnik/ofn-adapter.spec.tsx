import { expect, test, beforeEach } from 'vitest';
import { OfnAdapter } from "./ofn-adapter.tsx";
import { OfnModel } from "./ofn-model.ts";
import { UniversalModel } from "../../data-model-api/universal-model.ts";

let adapter: OfnAdapter;
let mockOfnModel: OfnModel;
let mockUniversalModel: UniversalModel;

beforeEach(() => {
  adapter = new OfnAdapter();
  mockOfnModel = {
    "@context": "test-context",
    iri: "test-iri",
    type: ["TestType"],
    name: { cs: "Test CS", en: "Test EN" },
    description: { cs: "Test Popis CS", en: "Test Popis EN" },
    created: { type: "Časový okamžik", date: "2025-01-01" }, 
    updated: {                                         
      type: "Časový okamžik",
      datetime: "2025-01-15T10:00:00+00:00"
    },
    extraProperty: "extraValue",
  };

  mockUniversalModel = {
    entities: [
      {
        label: "JSON Vocabulary Root",
        properties: [
          { label: "@context", type: {} },
          { label: "iri", type: {} },
          { label: "type", type: {} },
          { label: "name", type: {} },
          { label: "description", type: {} },
          { label: "created", type: {} },
          { label: "updated", type: {} },
          { label: "extraProperty", type: {} },
        ],
      },
    ],
  };
});

test("should correctly adapt from OfnModel to UniversalModel", async () => {
  const universalModel = await adapter.fromJsonVocabulary(mockOfnModel);
  expect(universalModel.entities.length).toBe(1);
  expect(universalModel.entities[0].label).toBe("JSON Vocabulary Root");
  expect(universalModel.entities[0].properties.length).toBe(Object.keys(mockOfnModel).length);
  expect(universalModel.entities[0].properties.find(p => p.label === "iri")?.label).toBe("iri");
});

test("should correctly adapt from UniversalModel to OfnModel (basic)", async () => {
  const ofnModel = await adapter.toJsonVocabulary(mockUniversalModel);
  expect(ofnModel["@context"]).toBe("https://ofn.gov.cz/slovníky/draft/kontexty/slovníky.jsonld");
  expect(ofnModel.iri).toBe("https://slovník.gov.cz/datový/turistické-cíle");
});

test("Root can be an object.", () => {
  const input = {
    type: "object",
    properties: {
      name: { type: "string" },
    },
  };
});
