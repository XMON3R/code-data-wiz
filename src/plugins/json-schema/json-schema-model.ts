import { DomainSpecificModel } from "../../data-model-api/domain-specific-model-api";

/**
 * Represents a JSON Schema property.
 * {@link https://json-schema.org/understanding-json-schema/reference/object}
 */
export interface JsonSchemaProperty {
    /** The name of the property. */
    name: string;
    /** The type of the property (e.g., "string", "number", "boolean", "array", "object", "null"). */
    type?: string | string[];
    /** A description of the property. */
    description?: string;
    /** Indicates if the property is required. */
    required?: boolean;
    /** The format of the property (e.g., "date-time", "email", "uri"). */
    format?: string;
    /** A JSON Pointer to a definition. */
    $ref?: string;
    /** For nested objects, defines the properties of the sub-object. */
    properties?: { [key: string]: JsonSchemaProperty };
    /** For arrays, defines the schema for items in the array. */
    items?: JsonSchemaProperty;
}

/**
 * Represents a full JSON Schema definition.
 */
export interface JsonSchemaDefinition {
    /** A URI for the schema. */
    $id?: string;
    /** The URI of the JSON Schema dialect used. */
    $schema?: string;
    /** The title of the schema. */
    title?: string;
    /** A description of the schema. */
    description?: string;
    /** The type of the schema (e.g., "object", "array", "string", "number", "boolean", "null"). */
    type?: string | string[];
    /** Defines the properties of an object. */
    properties?: { [key: string]: JsonSchemaProperty };
    /** A list of property names that are required. */
    required?: string[];
    /** For reusable definitions within the schema. */
    definitions?: { [key: string]: JsonSchemaDefinition };
}

/**
 * The domain-specific model for JSON Schema.
 * This represents the overall structure of a JSON Schema document.
 */
export interface JsonSchemaModel extends DomainSpecificModel {
    schema: JsonSchemaDefinition;
}
