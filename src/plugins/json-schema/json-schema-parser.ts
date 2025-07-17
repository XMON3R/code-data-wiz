import { DomainTextParser } from "../../data-model-api/domain-specific-model-api";
import { JsonSchemaModel, JsonSchemaDefinition, JsonSchemaProperty } from "./json-schema-model";

/**
 * A parser for JSON Schema strings into a JsonSchemaModel.
 */
export class JsonSchemaParser implements DomainTextParser<JsonSchemaModel> {
    /**
     * Parses a JSON Schema string into a JsonSchemaModel.
     * @param jsonSchemaString The JSON Schema as a string.
     * @returns A Promise resolving to the JsonSchemaModel.
     * @throws Error if the JSON Schema string is invalid.
     */
    async parseText(jsonSchemaString: string): Promise<JsonSchemaModel> {
        try {
            const parsedSchema: any = JSON.parse(jsonSchemaString);
            const schema: JsonSchemaDefinition = this.mapToSchemaDefinition(parsedSchema);
            return { schema: schema };
        } catch (error) {
            console.error("Error parsing JSON Schema string:", error);
            throw new Error("Invalid JSON Schema string provided.");
        }
    }

    /**
     * Maps a parsed JSON object to a JsonSchemaDefinition.
     * This method recursively processes properties and definitions.
     * @param parsed The parsed JSON object.
     * @returns A JsonSchemaDefinition object.
     */
    private mapToSchemaDefinition(parsed: any): JsonSchemaDefinition {
        const definition: JsonSchemaDefinition = {
            type: parsed.type,
        };

        if (parsed.$id) definition.$id = parsed.$id;
        if (parsed.$schema) definition.$schema = parsed.$schema;
        if (parsed.title) definition.title = parsed.title;
        if (parsed.description) definition.description = parsed.description;
        if (parsed.required) definition.required = parsed.required;

        if (parsed.properties) {
            definition.properties = {};
            for (const key in parsed.properties) {
                if (Object.prototype.hasOwnProperty.call(parsed.properties, key)) {
                    definition.properties[key] = this.mapToSchemaProperty(key, parsed.properties[key]);
                }
            }
        }

        if (parsed.definitions) {
            definition.definitions = {};
            for (const key in parsed.definitions) {
                if (Object.prototype.hasOwnProperty.call(parsed.definitions, key)) {
                    definition.definitions[key] = this.mapToSchemaDefinition(parsed.definitions[key]);
                }
            }
        }

        return definition;
    }

    /**
     * Maps a parsed JSON object to a JsonSchemaProperty.
     * This method handles nested properties and array items.
     * @param name The name of the property.
     * @param parsed The parsed JSON object representing the property.
     * @returns A JsonSchemaProperty object.
     */
    private mapToSchemaProperty(name: string, parsed: any): JsonSchemaProperty {
        const property: JsonSchemaProperty = {
            name: name,
            type: parsed.type,
        };

        if (parsed.description) property.description = parsed.description;
        if (parsed.required) property.required = parsed.required;

        if (parsed.properties) {
            property.properties = {};
            for (const key in parsed.properties) {
                if (Object.prototype.hasOwnProperty.call(parsed.properties, key)) {
                    property.properties[key] = this.mapToSchemaProperty(key, parsed.properties[key]);
                }
            }
        }

        if (parsed.items) {
            property.items = this.mapToSchemaProperty("items", parsed.items);
        }

        return property;
    }
}
