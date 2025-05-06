import { expect, test } from "vitest";
import { OfnWriter } from "./ofn-writer";
import { OfnModel } from "./ofn-model";

// Create a new instance of the OfnWriter for each test
const createWriter = () => new OfnWriter();

// Define a consistent mock model for testing
const mockModel: OfnModel = {
  "@context": "https://example.org/context",
  iri: "https://example.org/vocabulary",
  type: ["Vocabulary"],
  name: {
    cs: "Testovací slovník",
    en: "Test vocabulary",
  },
  description: {
    cs: "Toto je testovací slovník.",
    en: "This is a test vocabulary.",
  },
  created: {
    type: "Časový okamžik",
    date: "2025-04-11",
  },
  updated: {
    type: "Časový okamžik",
    datetime: "2025-04-11T15:25:00+02:00",
  },
  customProperty: "customValue",
};

test("write should convert a OfnModel to a formatted JSON string", async () => {
  const writer = createWriter();
  const expectedJson = JSON.stringify(mockModel, null, 2);
  const actualJson = await writer.write(mockModel);
  expect(actualJson).toBe(expectedJson);
});

test("write should handle an empty OfnModel and return an empty JSON object", async () => {
  const writer = createWriter();
  const emptyModel: OfnModel = {}; //  Changed to be a truly empty object
  const expectedJson = JSON.stringify({}, null, 2);
  const actualJson = await writer.write(emptyModel);
  expect(actualJson).toBe(expectedJson);
});

test("write should correctly serialize different data types within the model", async () => {
  const writer = createWriter();
  const modelWithDifferentTypes: OfnModel = {
    "@context": "test",
    iri: "123",
    type: ["true", "false"],
    name: { cs: null as any, en: undefined as any },
    description: { cs: "", en: "" },
    created: { type: "", date: "" },
    updated: { type: "", datetime: "" },
  };
  const expectedJson = JSON.stringify(modelWithDifferentTypes, null, 2);
  const actualJson = await writer.write(modelWithDifferentTypes);
  expect(actualJson).toBe(expectedJson);
});

test("write should handle nested objects correctly", async () => {
  const writer = createWriter();
  const nestedModel: OfnModel = {
    "@context": "test",
    iri: "test-iri",
    type: [],
    name: {},
    description: {},
    created: { type: "", date: "" },
    updated: { type: "", datetime: "" },
    nested: {
      level1: {
        level2: "value",
      },
    },
  };
  const expectedJson = JSON.stringify(nestedModel, null, 2);
  const actualJson = await writer.write(nestedModel);
  expect(actualJson).toBe(expectedJson);
});

test("write should handle arrays of primitive types", async () => {
  const writer = createWriter();
  const arrayModel: OfnModel = {
    "@context": "test",
    iri: "test-iri",
    type: ["one", "two", "three"],
    name: {},
    description: {},
    created: { type: "", date: "" },
    updated: { type: "", datetime: "" },
    items: [1, "two", true],
  };
  const expectedJson = JSON.stringify(arrayModel, null, 2);
  const actualJson = await writer.write(arrayModel);
  expect(actualJson).toBe(expectedJson);
});
