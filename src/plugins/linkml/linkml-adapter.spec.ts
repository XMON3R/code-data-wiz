import { describe, it, expect, beforeEach } from "vitest";
import { LinkmlAdapter } from "./linkml-adapter";
import { LinkmlModel } from "./linkml-model";
import { UniversalModel } from "../../data-model-api/universal-model";

describe("LinkmlAdapter", () => {
  let adapter: LinkmlAdapter;
  let mockLinkmlModel: LinkmlModel;
  let mockUniversalModel: UniversalModel;

  beforeEach(() => {
    adapter = new LinkmlAdapter();

    // Example LinkML Model for testing
    mockLinkmlModel = {
      schema: {
        id: "http://example.com/my_schema",
        name: "my_schema",
        description: "A simple LinkML schema for testing",
        classes: {
          Person: {
            description: "A person in the system",
            attributes: {
              id: {
                description: "Unique identifier for the person",
                range: "string",
                required: true,
              },
              name: {
                description: "Name of the person",
                range: "string",
              },
              age: {
                description: "Age of the person",
                range: "integer",
              },
            },
          },
          Organization: {
            description: "An organization",
            attributes: {
              orgId: {
                description: "Unique identifier for the organization",
                range: "string",
                required: true,
              },
              orgName: {
                description: "Name of the organization",
                range: "string",
              },
            },
          },
        },
      },
    };

    // Expected UniversalModel representation of the above LinkML Schema
    mockUniversalModel = {
      entities: [
        {
          label: "Person",
          properties: [
            { label: "id", type: { domainSpecificType: "string" } },
            { label: "name", type: { domainSpecificType: "string" } },
            { label: "age", type: { domainSpecificType: "integer" } },
          ],
        },
        {
          label: "Organization",
          properties: [
            { label: "orgId", type: { domainSpecificType: "string" } },
            { label: "orgName", type: { domainSpecificType: "string" } },
          ],
        },
      ],
    };
  });

  it("should correctly convert LinkmlModel to UniversalModel", async () => {
    const result = await adapter.toUniversalModel(mockLinkmlModel);
    expect(result).toEqual(mockUniversalModel);
  });

  it("should correctly convert UniversalModel to LinkmlModel", async () => {
    const result = await adapter.fromUniversalModel(mockUniversalModel);
    // Due to potential differences in default values or ordering, a direct toEqual might fail.
    // We'll check key properties for consistency.
    expect(result.schema.name).toEqual(mockLinkmlModel.schema.name);
    expect(Object.keys(result.schema.classes || {})).toEqual(Object.keys(mockLinkmlModel.schema.classes || {}));

    // Check properties of a specific class
    const personClass = result.schema.classes?.Person;
    const mockPersonClass = mockLinkmlModel.schema.classes?.Person;
    expect(personClass?.description).toEqual(mockPersonClass?.description);
    expect(Object.keys(personClass?.attributes || {})).toEqual(Object.keys(mockPersonClass?.attributes || {}));
    expect(personClass?.attributes?.id?.range).toEqual(mockPersonClass?.attributes?.id?.range);
    expect(personClass?.attributes?.name?.range).toEqual(mockPersonClass?.attributes?.name?.range);
    expect(personClass?.attributes?.age?.range).toEqual(mockPersonClass?.attributes?.age?.range);
  });

  it("should maintain data consistency after a full conversion cycle", async () => {
    console.log("--- START: Full conversion cycle test for LinkmlAdapter ---");

    // Step 1: Convert from LinkML Model to Universal Model
    console.log("Step 1: Converting LinkmlModel -> UniversalModel");
    console.log("Input LinkmlModel:", JSON.stringify(mockLinkmlModel, null, 2));
    const universal = await adapter.toUniversalModel(mockLinkmlModel);
    console.log("Resulting UniversalModel:", JSON.stringify(universal, null, 2));
    expect(universal).toEqual(mockUniversalModel);
    console.log("Step 1 check: OK");

    // Step 2: Convert from Universal Model back to LinkML Model
    console.log("\nStep 2: Converting UniversalModel -> LinkmlModel");
    const finalLinkml = await adapter.fromUniversalModel(universal);
    console.log("Resulting LinkmlModel:", JSON.stringify(finalLinkml, null, 2));

    // Check for consistency (similar to the fromUniversalModel test)
    expect(finalLinkml.schema.name).toEqual(mockLinkmlModel.schema.name);
    expect(Object.keys(finalLinkml.schema.classes || {})).toEqual(Object.keys(mockLinkmlModel.schema.classes || {}));

    const finalPersonClass = finalLinkml.schema.classes?.Person;
    const mockPersonClass = mockLinkmlModel.schema.classes?.Person;
    expect(finalPersonClass?.description).toEqual(mockPersonClass?.description);
    expect(Object.keys(finalPersonClass?.attributes || {})).toEqual(Object.keys(mockPersonClass?.attributes || {}));
    expect(finalPersonClass?.attributes?.id?.range).toEqual(mockPersonClass?.attributes?.id?.range);
    expect(finalPersonClass?.attributes?.name?.range).toEqual(mockPersonClass?.attributes?.name?.range);
    expect(finalPersonClass?.attributes?.age?.range).toEqual(mockPersonClass?.attributes?.age?.range);

    console.log("Step 2 check: OK");
    console.log("--- END: Test completed successfully ---");
  });

  it("should handle an empty LinkmlModel", async () => {
    const emptyLinkml: LinkmlModel = {
      schema: {
        id: "http://example.com/empty_schema",
        name: "empty_schema",
        classes: {},
      },
    };
    const expectedModel: UniversalModel = { entities: [] };
    const result = await adapter.toUniversalModel(emptyLinkml);
    expect(result).toEqual(expectedModel);
  });

  it("should handle an empty UniversalModel", async () => {
    const emptyModel: UniversalModel = { entities: [] };
    const expectedLinkml: LinkmlModel = {
      schema: {
        id: "http://example.com/linkml-schema",
        name: "example_schema",
        classes: {},
        slots: {},
      },
    };
    const result = await adapter.fromUniversalModel(emptyModel);
    // Check for basic structure, as the adapter might add default properties
    expect(result.schema.id).toEqual(expectedLinkml.schema.id);
    expect(result.schema.name).toEqual(expectedLinkml.schema.name);
    expect(result.schema.classes).toEqual(expectedLinkml.schema.classes);
  });
});
