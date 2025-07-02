import { describe, it, expect, beforeEach } from "vitest";
import { JsonSchemaAdapter } from "./json-schema-adapter"; 
import { JsonSchemaModel } from "./json-schema-model";
import { UniversalModel } from "../../data-model-api/universal-model";

describe("JsonSchemaAdapter", () => {
  let adapter: JsonSchemaAdapter;
  let mockJsonSchema: JsonSchemaModel;
  let mockUniversalModel: UniversalModel;

  beforeEach(() => {
    adapter = new JsonSchemaAdapter();

    // Example JSON Schema for testing
    mockJsonSchema = {
      schema: {
        $schema: "http://json-schema.org/draft-07/schema#",
        title: "User",
        type: "object",
        properties: {
          id: {
            name: "id",
            type: "integer",
            description: "Unique identifier for the user",
          },
          name: {
            name: "name",
            type: "string",
            description: "Full name of the user",
          },
          email: {
            name: "email",
            type: "string",
            format: "email",
            description: "Email address of the user",
          },
        },
        required: ["id", "name", "email"],
      },
    };

    // Expected UniversalModel representation of the above JSON Schema
    mockUniversalModel = {
      entities: [
        {
          label: "User",
          properties: [
            { label: "id", type: { domainSpecificType: "integer" } },
            { label: "name", type: { domainSpecificType: "string" } },
            { label: "email", type: { domainSpecificType: "string", format: "email" } },
          ],
        },
      ],
    };
  });

  it("should correctly convert JsonSchemaModel to UniversalModel", async () => {
    const result = await adapter.toUniversalModel(mockJsonSchema);
    expect(result).toEqual(mockUniversalModel);
  });

  it("should correctly convert UniversalModel to JsonSchemaModel", async () => {
    const result = await adapter.fromUniversalModel(mockUniversalModel);
    // For fromUniversalModel, we might need a more complex mockJsonSchema to ensure all properties are covered
    // For now, a basic check is sufficient, assuming the adapter will fill in defaults like $schema, title, type, required
    expect(result.schema.title).toEqual(mockJsonSchema.schema.title);
    expect(result.schema.type).toEqual(mockJsonSchema.schema.type);
    expect(result.schema.properties?.id?.type).toEqual(mockJsonSchema.schema.properties?.id?.type);
    expect(result.schema.properties?.name?.type).toEqual(mockJsonSchema.schema.properties?.name?.type);
    expect(result.schema.properties?.email?.type).toEqual(mockJsonSchema.schema.properties?.email?.type);
  });

  it("should maintain data consistency after a full conversion cycle", async () => {
    console.log("--- START: Full conversion cycle test for JsonSchemaAdapter ---");

    // Step 1: Convert from JSON Schema to Universal Model
    console.log("Step 1: Converting JsonSchemaModel -> UniversalModel");
    console.log("Input JsonSchemaModel:", JSON.stringify(mockJsonSchema, null, 2));
    const universal = await adapter.toUniversalModel(mockJsonSchema);
    console.log("Resulting UniversalModel:", JSON.stringify(universal, null, 2));
    expect(universal).toEqual(mockUniversalModel);
    console.log("Step 1 check: OK");

    // Step 2: Convert from Universal Model back to JSON Schema
    console.log("\nStep 2: Converting UniversalModel -> JsonSchemaModel");
    const finalJsonSchema = await adapter.fromUniversalModel(universal);
    console.log("Resulting JsonSchemaModel:", JSON.stringify(finalJsonSchema, null, 2));

    // Due to potential differences in default values or ordering, a direct toEqual might fail.
    // We'll check key properties for consistency.
    expect(finalJsonSchema.schema.title).toEqual(mockJsonSchema.schema.title);
    expect(finalJsonSchema.schema.type).toEqual(mockJsonSchema.schema.type);
    expect(finalJsonSchema.schema.properties?.id?.type).toEqual(mockJsonSchema.schema.properties?.id?.type);
    expect(finalJsonSchema.schema.properties?.name?.type).toEqual(mockJsonSchema.schema.properties?.name?.type);
    expect(finalJsonSchema.schema.properties?.email?.type).toEqual(mockJsonSchema.schema.properties?.email?.type);
    // Add more specific checks if needed for 'required' array or 'format'
    expect(finalJsonSchema.schema.required).toEqual(expect.arrayContaining(mockJsonSchema.schema.required || []));
    expect(finalJsonSchema.schema.properties?.email?.format).toEqual(mockJsonSchema.schema.properties?.email?.format);

    console.log("Step 2 check: OK");
    console.log("--- END: Test completed successfully ---");
  });

  it("should handle an empty JsonSchemaModel", async () => {
    const emptySchema: JsonSchemaModel = {
      schema: {
        $schema: "http://json-schema.org/draft-07/schema#",
        title: "Empty",
        type: "object",
        properties: {},
      },
    };
    const expectedModel: UniversalModel = { entities: [{ label: "Empty", properties: [] }] };
    const result = await adapter.toUniversalModel(emptySchema);
    expect(result).toEqual(expectedModel);
  });

  it("should handle an empty UniversalModel", async () => {
    const emptyModel: UniversalModel = { entities: [] };
    const expectedSchema: JsonSchemaModel = {
      schema: {
        $schema: "http://json-schema.org/draft-07/schema#",
        title: "Root", // Default title if not inferred
        type: "object",
        properties: {},
      },
    };
    const result = await adapter.fromUniversalModel(emptyModel);
    // Check for basic structure, as the adapter might add default properties
    expect(result.schema.type).toEqual(expectedSchema.schema.type);
    expect(result.schema.properties).toEqual(expectedSchema.schema.properties);
  });

  it("should throw an error when toUniversalModel receives a null JsonSchemaModel", async () => {
    const nullSchema: JsonSchemaModel = null as any; // Simulate null input
    await expect(adapter.toUniversalModel(nullSchema)).rejects.toThrow(TypeError);
  });

  it("should throw an error when toUniversalModel receives an undefined JsonSchemaModel", async () => {
    const undefinedSchema: JsonSchemaModel = undefined as any; // Simulate undefined input
    await expect(adapter.toUniversalModel(undefinedSchema)).rejects.toThrow(TypeError);
  });

  it("should throw an error when fromUniversalModel receives a null UniversalModel", async () => {
    const nullModel: UniversalModel = null as any; // Simulate null input
    await expect(adapter.fromUniversalModel(nullModel)).rejects.toThrow(TypeError);
  });

  it("should throw an error when fromUniversalModel receives an undefined UniversalModel", async () => {
    const undefinedModel: UniversalModel = undefined as any; // Simulate undefined input
    await expect(adapter.fromUniversalModel(undefinedModel)).rejects.toThrow(TypeError);
  });
});
