import { expect, test } from "vitest";
import { JsonSchemaWriter } from "./json-schema-writer";
import { JsonSchemaModel } from "./json-schema-model";

const writer = new JsonSchemaWriter();

test("should write a simple object schema", async () => {
    const model: JsonSchemaModel = {
        schema: {
            $schema: "http://json-schema.org/draft-07/schema#",
            $id: "http://example.com/product.schema.json",
            title: "Product",
            description: "A product in the catalog",
            type: "object",
            properties: {
                productId: {
                    name: "productId",
                    type: "string",
                    description: "The unique identifier for a product"
                },
                productName: {
                    name: "productName",
                    type: "string"
                },
                price: {
                    name: "price",
                    type: "number",
                    required: true
                }
            },
            required: ["productId", "productName", "price"]
        }
    };
    const expected = `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "http://example.com/product.schema.json",
  "title": "Product",
  "description": "A product in the catalog",
  "type": "object",
  "properties": {
    "price": {
      "type": "number",
      "required": true
    },
    "productId": {
      "type": "string",
      "description": "The unique identifier for a product"
    },
    "productName": {
      "type": "string"
    }
  },
  "required": [
    "productId",
    "productName",
    "price"
  ]
}`;
    const result = await writer.writeText(model);
    expect(result).toEqual(expected);
});

test("should write a schema with nested properties", async () => {
    const model: JsonSchemaModel = {
        schema: {
            type: "object",
            properties: {
                address: {
                    name: "address",
                    type: "object",
                    properties: {
                        street: { name: "street", type: "string" },
                        city: { name: "city", type: "string" }
                    }
                }
            }
        }
    };
    const expected = `{
  "type": "object",
  "properties": {
    "address": {
      "type": "object",
      "properties": {
        "city": {
          "type": "string"
        },
        "street": {
          "type": "string"
        }
      }
    }
  }
}`;
    const result = await writer.writeText(model);
    expect(result).toEqual(expected);
});

test("should write a schema with an array of objects", async () => {
    const model: JsonSchemaModel = {
        schema: {
            type: "object",
            properties: {
                items: {
                    name: "items",
                    type: "array",
                    items: {
                        name: "items",
                        type: "object",
                        properties: {
                            name: { name: "name", type: "string" },
                            quantity: { name: "quantity", type: "number" }
                        }
                    }
                }
            }
        }
    };
    const expected = `{
  "type": "object",
  "properties": {
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "quantity": {
            "type": "number"
          }
        }
      }
    }
  }
}`;
    const result = await writer.writeText(model);
    expect(result).toEqual(expected);
});

test("should write a schema with definitions", async () => {
    const model: JsonSchemaModel = {
        schema: {
            type: "object",
            properties: {
                user: {
                    name: "user",
                    // type: undefined, // $ref properties don't have a direct 'type' in the parsed object
                }
            },
            definitions: {
                User: {
                    type: "object",
                    properties: {
                        id: { name: "id", type: "integer" },
                        name: { name: "name", type: "string" }
                    },
                    required: ["id", "name"]
                }
            }
        }
    };
    const expected = `{
  "type": "object",
  "properties": {
    "user": {}
  },
  "definitions": {
    "User": {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer"
        },
        "name": {
          "type": "string"
        }
      },
      "required": [
        "id",
        "name"
      ]
    }
  }
}`;
    const result = await writer.writeText(model);
    expect(result).toEqual(expected);
});

test("should handle an empty schema", async () => {
    const model: JsonSchemaModel = {
        schema: {
            type: undefined,
        }
    };
    const expected = `{}`;
    const result = await writer.writeText(model);
    expect(result).toEqual(expected);
});

test("should throw an error for null JsonSchemaModel input", async () => {
    const model: JsonSchemaModel = null as any; // Cast to any to simulate invalid input
    await expect(writer.writeText(model)).rejects.toThrow(TypeError);
});

test("should throw an error for undefined JsonSchemaModel input", async () => {
    const model: JsonSchemaModel = undefined as any; // Cast to any to simulate invalid input
    await expect(writer.writeText(model)).rejects.toThrow(TypeError);
});

test("should handle a schema with null properties gracefully", async () => {
    const model: JsonSchemaModel = {
        schema: {
            type: "object",
            properties: {
                nullableProp: null as any, // Simulate a null property definition
            },
        },
    };
    const expected = `{
  "type": "object",
  "properties": {
    "nullableProp": null
  }
}`;
    const result = await writer.writeText(model);
    expect(JSON.parse(result)).toEqual(JSON.parse(expected));
});
