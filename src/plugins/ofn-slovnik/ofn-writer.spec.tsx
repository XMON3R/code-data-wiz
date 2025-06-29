import { describe, it, expect } from "vitest";
import { OfnWriter } from "./ofn-writer";
import { OfnModel } from "./ofn-model";

// Use a describe block to group related tests for the OfnWriter
describe("OfnWriter", () => {
  const writer = new OfnWriter();

  it("should convert a full OfnModel to a formatted JSON string", async () => {
    // This model correctly implements all properties of the OfnModel interface.
    const fullModel: OfnModel = {
      iri: "https://example.com/vocabulary/1",
      name: {
        cs: "Testovací slovník",
        en: "Test Vocabulary",
      },
      description: {
        cs: "Toto je popis.",
        en: "This is a description.",
      },
      createdAt: "2025-01-15T10:00:00Z",
      updatedAt: "2025-01-16T12:30:00Z",
    };

    const expectedJson = JSON.stringify(fullModel, null, 2);
    const actualJson = await writer.write(fullModel);
    expect(actualJson).toBe(expectedJson);
  });

  it("should handle a minimal OfnModel with only required properties", async () => {
    // The 'OfnModel' requires 'name' and 'description' properties.
    const minimalModel: OfnModel = {
      name: {
        cs: "Minimální název",
      },
      description: {
        en: "Minimal description",
      },
    };

    const expectedJson = JSON.stringify(minimalModel, null, 2);
    const actualJson = await writer.write(minimalModel);
    expect(actualJson).toBe(expectedJson);
  });

  it("should handle models where optional properties are undefined", async () => {
    // This test ensures that optional fields like 'iri' are not included
    // in the output if they are not present in the model.
    const modelWithoutIri: OfnModel = {
      name: { en: "No IRI" },
      description: { en: "This model lacks an IRI" },
      createdAt: "2025-01-15T10:00:00Z",
    };

    const expectedJson = JSON.stringify(modelWithoutIri, null, 2);
    const actualJson = await writer.write(modelWithoutIri);
    expect(actualJson).toBe(expectedJson);
  });

  it("should correctly serialize partial or empty name/description objects", async () => {
    // This test checks how the writer handles cases where language-specific
    // fields within name or description are missing.
    const partialModel: OfnModel = {
      iri: "https://example.com/vocabulary/3",
      name: {
        cs: "Částečný název",
        // 'en' name is missing
      },
      description: {
        // 'cs' description is missing
        en: "Partial description",
      },
    };

    const expectedJson = JSON.stringify(partialModel, null, 2);
    const actualJson = await writer.write(partialModel);
    expect(actualJson).toBe(expectedJson);
  });
});
