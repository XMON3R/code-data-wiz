import { describe, it, expect } from "vitest";
import { OfnWriter } from "./ofn-writer";
import { OfnModel } from "./ofn-model";

// Use a describe block to group related tests for the OfnWriter
describe("OfnWriter", () => {
  const writer = new OfnWriter();

  it("should convert a full OfnModel to a formatted JSON string with Czech keys", async () => {
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
      concepts: [
        {
          iri: "http://example.com/concept1",
          type: ["Třída"],
          name: { en: "MyClass" },
          subClassOf: ["http://example.com/superClass"],
        },
      ],
    };

    const expectedCzechJson = {
      "iri": "https://example.com/vocabulary/1",
      "název": {
        "cs": "Testovací slovník",
        "en": "Test Vocabulary",
      },
      "popis": {
        "cs": "Toto je popis.",
        "en": "This is a description.",
      },
      "pojmy": [
        {
          "iri": "http://example.com/concept1",
          "typ": ["Třída"],
          "název": { "en": "MyClass" },
          "nadřazená-třída": ["http://example.com/superClass"],
        },
      ],
    };

    const actualJson = await writer.writeText(fullModel);
    expect(JSON.parse(actualJson)).toEqual(expectedCzechJson);
  });

  it("should handle a minimal OfnModel with only required properties", async () => {
    const minimalModel: OfnModel = {
      name: {
        cs: "Minimální název",
      },
      description: {
        en: "Minimal description",
      },
    };

    const expectedCzechJson = {
      "název": {
        "cs": "Minimální název",
      },
      "popis": {
        "en": "Minimal description",
      },
    };

    const actualJson = await writer.writeText(minimalModel);
    expect(JSON.parse(actualJson)).toEqual(expectedCzechJson);
  });
});
