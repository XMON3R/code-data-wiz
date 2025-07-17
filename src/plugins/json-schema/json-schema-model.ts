import { DomainSpecificModel } from "../../data-model-api/domain-specific-model-api";

/**
 * Represents a JSON Schema definition.
 * {@link https://json-schema.org/understanding-json-schema/reference/object}
 */

export interface JsonSchemaProperty {
    name: string;
    type?: string | string[]; // e.g., "string", "number", "boolean", "array", "object", "null"
    description?: string;
    required?: boolean;
    format?: string; // Added format property
    $ref?: string;
    // Add other JSON Schema keywords for properties like 'pattern', 'minLength', 'maxLength', 'enum', 'default', 'examples'
    // For nested objects or arrays, 'properties' or 'items' would be used, which implies a recursive structure.
    // For simplicity, this model focuses on basic types and direct properties.
    properties?: { [key: string]: JsonSchemaProperty }; // For nested objects
    items?: JsonSchemaProperty; // For array items
}

export interface JsonSchemaDefinition {
    $id?: string; // A URI for the schema
    $schema?: string; // The URI of the JSON Schema dialect used
    title?: string;
    description?: string;
    type?: string | string[]; // "object", "array", "string", "number", "boolean", "null"
    properties?: { [key: string]: JsonSchemaProperty };
    required?: string[]; // List of required property names
    definitions?: { [key: string]: JsonSchemaDefinition }; // For reusable definitions
    // Add other top-level JSON Schema keywords like 'allOf', 'anyOf', 'oneOf', 'not', 'enum', 'const', 'examples'
}

/**
 * The domain-specific model for JSON Schema.
 * This represents the overall structure of a JSON Schema document.
 */
export interface JsonSchemaModel extends DomainSpecificModel {
    schema: JsonSchemaDefinition;
}
