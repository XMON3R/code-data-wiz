import { expect, test } from 'vitest';
import { JsonVocabularyWriter } from "./json-vocabulary-writer";
import { JsonVocabularyModel } from "./json-vocabulary-model";

// Create a new instance of the JsonVocabularyWriter for each test
const createWriter = () => new JsonVocabularyWriter();

// Define a consistent mock model for testing
const mockModel: JsonVocabularyModel = {
  "@context": "https://example.org/context",
  "iri": "https://example.org/vocabulary",
  "typ": ["Vocabulary"],
  "název": {
    "cs": "Testovací slovník",
    "en": "Test vocabulary"
  },
  "popis": {
    "cs": "Toto je testovací slovník.",
    "en": "This is a test vocabulary."
  },
  "vytvořeno": {
    "typ": "Časový okamžik",
    "datum": "2025-04-11"
  },
  "aktualizováno": {
    "typ": "Časový okamžik",
    "datum_a_čas": "2025-04-11T15:25:00+02:00"
  },
  "customProperty": "customValue"
};

test('write should convert a JsonVocabularyModel to a formatted JSON string', async () => {
  const writer = createWriter();
  const expectedJson = JSON.stringify(mockModel, null, 2);
  const actualJson = await writer.write(mockModel);
  expect(actualJson).toBe(expectedJson);
});

test('write should handle an empty JsonVocabularyModel and return an empty JSON object', async () => {
  const writer = createWriter();
  const emptyModel: JsonVocabularyModel = {} as JsonVocabularyModel; // Type assertion for an empty object
  const expectedJson = JSON.stringify({}, null, 2);
  const actualJson = await writer.write(emptyModel);
  expect(actualJson).toBe(expectedJson);
});

test('write should correctly serialize different data types within the model', async () => {
  const writer = createWriter();
  const modelWithDifferentTypes: JsonVocabularyModel = {
    "@context": "test",
    "iri": "123", // Corrected to string
    "typ": ["true", "false"], // Corrected to array of strings
    "název": { "cs": null as any, "en": undefined as any }, // Allow null and undefined
    "popis": { "cs": "", "en": "" },
    "vytvořeno": { "typ": "", "datum": "" },
    "aktualizováno": { "typ": "", "datum_a_čas": "" },
  };
  const expectedJson = JSON.stringify(modelWithDifferentTypes, null, 2);
  const actualJson = await writer.write(modelWithDifferentTypes);
  expect(actualJson).toBe(expectedJson);
});

test('write should handle nested objects correctly', async () => {
  const writer = createWriter();
  const nestedModel: Partial<JsonVocabularyModel> = { // Use Partial to indicate not all properties are present
    "@context": "test",
    "nested": {
      "level1": {
        "level2": "value"
      }
    }
  };
  const expectedJson = JSON.stringify(nestedModel, null, 2);
  const actualJson = await writer.write(nestedModel as JsonVocabularyModel); // Explicitly cast for write
  expect(actualJson).toBe(expectedJson);
});

test('write should handle arrays of primitive types', async () => {
  const writer = createWriter();
  const arrayModel: Partial<JsonVocabularyModel> = { // Use Partial
    "@context": "test",
    "iri": "test-iri",
    "typ": ["one", "two", "three"],
    "název": { "cs": "", "en": "" },
    "popis": { "cs": "", "en": "" },
    "vytvořeno": { "typ": "", "datum": "" },
    "aktualizováno": { "typ": "", "datum_a_čas": "" },
    "items": [1, "two", true]
  };
  const expectedJson = JSON.stringify(arrayModel, null, 2);
  const actualJson = await writer.write(arrayModel as JsonVocabularyModel); // Explicitly cast
  expect(actualJson).toBe(expectedJson);
});