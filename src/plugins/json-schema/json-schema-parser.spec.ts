import { expect, test } from "vitest";
import { JsonSchemaTextParser } from "./json-schema-parser";
import { JsonSchemaModel } from "./json-schema-model";

const parser = new JsonSchemaTextParser();

test("should parse a simple object schema", async () => {
    const input = `
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "http://example.com/product.schema.json",
    "title": "Product",
    "description": "A product in the catalog",
    "type": "object",
    "properties": {
        "productId": {
            "type": "string",
            "description": "The unique identifier for a product"
        },
        "productName": {
            "type": "string"
        },
        "price": {
            "type": "number",
            "required": true
        }
    },
    "required": ["productId", "productName", "price"]
}`;
    const expected: JsonSchemaModel = {
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
    const result = await parser.parseText(input);
    expect(result).toEqual(expected);
});

test("should parse a schema with nested properties", async () => {
    const input = `
{
    "type": "object",
    "properties": {
        "address": {
            "type": "object",
            "properties": {
                "street": { "type": "string" },
                "city": { "type": "string" }
            }
        }
    }
}`;
    const expected: JsonSchemaModel = {
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
    const result = await parser.parseText(input);
    expect(result).toEqual(expected);
});

test("should parse a schema with an array of objects", async () => {
    const input = `
{
    "type": "object",
    "properties": {
        "items": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": { "type": "string" },
                    "quantity": { "type": "number" }
                }
            }
        }
    }
}`;
    const expected: JsonSchemaModel = {
        schema: {
            type: "object",
            properties: {
                items: {
                    name: "items",
                    type: "array",
                    items: {
                        name: "items", // The name for array items is typically not explicitly defined in schema, but our model requires it.
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
    const result = await parser.parseText(input);
    expect(result).toEqual(expected);
});

test("should handle schema with definitions", async () => {
    const input = `
{
    "type": "object",
    "properties": {
        "user": { "$ref": "#/definitions/User" }
    },
    "definitions": {
        "User": {
            "type": "object",
            "properties": {
                "id": { "type": "integer" },
                "name": { "type": "string" }
            },
            "required": ["id", "name"]
        }
    }
}`;
    const expected: JsonSchemaModel = {
        schema: {
            type: "object",
            properties: {
                user: {
                    name: "user",
                    type: undefined, // $ref properties don't have a direct 'type' in the parsed object
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
    const result = await parser.parseText(input);
    expect(result).toEqual(expected);
});

test("should throw error for invalid JSON", async () => {
    const input = `{ "type": "object", "properties": { "name": "string" }`; // Missing closing brace
    await expect(parser.parseText(input)).rejects.toThrow("Invalid JSON Schema string provided.");
});

test("should throw error for non-object JSON input", async () => {
    const input = `"just a string"`;
    await expect(parser.parseText(input)).rejects.toThrow("Invalid JSON Schema: Root must be an object.");
});

test("should return an empty schema for an empty object input", async () => {
    const input = `{}`;
    const expected: JsonSchemaModel = {
        schema: {
            type: undefined, // An empty object doesn't define a type
        }
    };
    const result = await parser.parseText(input);
    expect(result).toEqual(expected);
});
