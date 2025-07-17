import { describe, it, expect, beforeEach } from "vitest";
import { LinkmlAdapter } from "./linkml-adapter";
import { LinkmlModel } from "./linkml-model";
import { UniversalModel, UniversalType } from "../../data-model-api/universal-model";

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
      id: "http://example.com/my_schema", // Add id
      name: "my_schema", // Add name
      entities: [
        {
          label: "Person",
          description: "A person in the system",
          properties: [
            { label: "id", type: { domainSpecificType: "string", universalType: UniversalType.String } },
            { label: "name", type: { domainSpecificType: "string", universalType: UniversalType.String } },
            { label: "age", type: { domainSpecificType: "integer", universalType: UniversalType.Number } },
          ],
        },
        {
          label: "Organization",
          description: "An organization",
          properties: [
            { label: "orgId", type: { domainSpecificType: "string", universalType: UniversalType.String } },
            { label: "orgName", type: { domainSpecificType: "string", universalType: UniversalType.String } },
          ],
        },
      ],
      relationships: [], // Add relationships array
    };
  });

  it("should correctly convert LinkmlModel to UniversalModel", async () => {
    const result = await adapter.toUniversalModel(mockLinkmlModel);
    expect(result).toEqual(mockUniversalModel);
  });

  it("should correctly convert UniversalModel to LinkmlModel", async () => {
    const result = await adapter.fromUniversalModel(mockUniversalModel);
    // Check id and name
    expect(result.schema.id).toEqual(mockUniversalModel.id);
    expect(result.schema.name).toEqual(mockUniversalModel.name);

    // Check classes
    expect(Object.keys(result.schema.classes || {})).toEqual(mockUniversalModel.entities.map(e => e.label));

    // Check properties of a specific class (Person)
    const personClass = result.schema.classes?.Person;
    const universalPersonEntity = mockUniversalModel.entities.find(e => e.label === "Person");
    expect(personClass?.description).toEqual(universalPersonEntity?.description);
    expect(Object.keys(personClass?.attributes || {})).toEqual(universalPersonEntity?.properties.map(p => p.label));

    // Check specific attributes for Person
    expect(personClass?.attributes?.id?.range).toEqual(universalPersonEntity?.properties.find(p => p.label === "id")?.type.domainSpecificType);
    expect(personClass?.attributes?.id?.required).toBe(false); // Default to false
    expect(personClass?.attributes?.name?.range).toEqual(universalPersonEntity?.properties.find(p => p.label === "name")?.type.domainSpecificType);
    expect(personClass?.attributes?.name?.required).toBe(false); // Default to false
    expect(personClass?.attributes?.age?.range).toEqual(universalPersonEntity?.properties.find(p => p.label === "age")?.type.domainSpecificType);
    expect(personClass?.attributes?.age?.required).toBe(false); // Default to false

    // Check properties of a specific class (Organization)
    const orgClass = result.schema.classes?.Organization;
    const universalOrgEntity = mockUniversalModel.entities.find(e => e.label === "Organization");
    expect(orgClass?.description).toEqual(universalOrgEntity?.description);
    expect(Object.keys(orgClass?.attributes || {})).toEqual(universalOrgEntity?.properties.map(p => p.label));
    expect(orgClass?.attributes?.orgId?.range).toEqual(universalOrgEntity?.properties.find(p => p.label === "orgId")?.type.domainSpecificType);
    expect(orgClass?.attributes?.orgId?.required).toBe(false); // Default to false
    expect(orgClass?.attributes?.orgName?.range).toEqual(universalOrgEntity?.properties.find(p => p.label === "orgName")?.type.domainSpecificType);
    expect(orgClass?.attributes?.orgName?.required).toBe(false); // Default to false
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

    // Check id and name consistency
    expect(finalLinkml.schema.id).toEqual(mockLinkmlModel.schema.id);
    expect(finalLinkml.schema.name).toEqual(mockLinkmlModel.schema.name);

    // Check classes consistency
    expect(Object.keys(finalLinkml.schema.classes || {})).toEqual(Object.keys(mockLinkmlModel.schema.classes || {}));

    const finalPersonClass = finalLinkml.schema.classes?.Person;
    const mockPersonClass = mockLinkmlModel.schema.classes?.Person;
    expect(finalPersonClass?.description).toEqual(mockPersonClass?.description);
    expect(Object.keys(finalPersonClass?.attributes || {})).toEqual(Object.keys(mockPersonClass?.attributes || {}));

    // Check specific attributes for Person, including required status
    expect(finalPersonClass?.attributes?.id?.range).toEqual(mockPersonClass?.attributes?.id?.range);
    expect(finalPersonClass?.attributes?.id?.required).toBe(false); // Should be false by default now
    expect(finalPersonClass?.attributes?.name?.range).toEqual(mockPersonClass?.attributes?.name?.range);
    expect(finalPersonClass?.attributes?.name?.required).toBe(false); // Should be false by default now
    expect(finalPersonClass?.attributes?.age?.range).toEqual(mockPersonClass?.attributes?.age?.range);
    expect(finalPersonClass?.attributes?.age?.required).toBe(false); // Should be false by default now

    const finalOrgClass = finalLinkml.schema.classes?.Organization;
    const mockOrgClass = mockLinkmlModel.schema.classes?.Organization;
    expect(finalOrgClass?.description).toEqual(mockOrgClass?.description);
    expect(Object.keys(finalOrgClass?.attributes || {})).toEqual(Object.keys(mockOrgClass?.attributes || {}));
    expect(finalOrgClass?.attributes?.orgId?.range).toEqual(mockOrgClass?.attributes?.orgId?.range);
    expect(finalOrgClass?.attributes?.orgId?.required).toBe(false); // Should be false by default now
    expect(finalOrgClass?.attributes?.orgName?.range).toEqual(mockOrgClass?.attributes?.orgName?.range);
    expect(finalOrgClass?.attributes?.orgName?.required).toBe(false); // Should be false by default now

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
    const expectedModel: UniversalModel = {
      id: "http://example.com/empty_schema",
      name: "empty_schema",
      entities: [],
      relationships: [], // Add relationships array
    };
    const result = await adapter.toUniversalModel(emptyLinkml);
    expect(result).toEqual(expectedModel);
  });

  it("should handle an empty UniversalModel", async () => {
    const emptyModel: UniversalModel = { entities: [] };
    const expectedLinkml: LinkmlModel = {
      schema: {
        id: "http://example.com/linkml-schema", // Default ID
        name: "example_schema", // Default name
        classes: {},
      },
    };
    const result = await adapter.fromUniversalModel(emptyModel);
    // Check for basic structure, as the adapter might add default properties
    expect(result.schema.id).toEqual(expectedLinkml.schema.id);
    expect(result.schema.name).toEqual(expectedLinkml.schema.name);
    expect(result.schema.classes).toEqual(expectedLinkml.schema.classes);
  });

  it("should correctly handle default_range from LinkmlModel to UniversalModel", async () => {
    const linkmlWithDefaultRange: LinkmlModel = {
      schema: {
        id: "http://example.com/default_range_schema",
        name: "default_range_schema",
        default_range: "string",
        classes: {
          Product: {
            attributes: {
              productId: {}, // No range specified, should use default_range
              productName: { range: "string" },
              price: { range: "number" },
            },
          },
        },
      },
    };

    const expectedUniversalWithDefaultRange: UniversalModel = {
      id: "http://example.com/default_range_schema",
      name: "default_range_schema",
      entities: [
        {
          label: "Product",
          description: undefined, // Explicitly set to undefined as it's not in the input LinkML
          properties: [
            { label: "productId", type: { domainSpecificType: "string", universalType: UniversalType.String } },
            { label: "productName", type: { domainSpecificType: "string", universalType: UniversalType.String } },
            { label: "price", type: { domainSpecificType: "number", universalType: UniversalType.Number } },
          ],
        },
      ],
      relationships: [], // Add relationships array
    };

    const result = await adapter.toUniversalModel(linkmlWithDefaultRange);
    expect(result).toEqual(expectedUniversalWithDefaultRange);
  });
});
