import { DomainTextParser } from "../../data-model-api/domain-specific-model-api";
import { JsonSchemaModel, JsonSchemaDefinition, JsonSchemaProperty } from "./json-schema-model";

/**
 * A parser for JSON Schema strings into a JsonSchemaModel.
 */
export class JsonSchemaTextParser implements DomainTextParser<JsonSchemaModel> {
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
