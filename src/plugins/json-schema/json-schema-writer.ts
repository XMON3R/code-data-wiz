import { DomainTextWriter } from "../../data-model-api/domain-specific-model-api";
import { JsonSchemaModel, JsonSchemaDefinition, JsonSchemaProperty } from "./json-schema-model";

/**
 * A writer for converting a JsonSchemaModel into a JSON Schema string.
 */
export class JsonSchemaWriter implements DomainTextWriter<JsonSchemaModel> {
    /**
     * Converts a JsonSchemaModel object into a formatted JSON Schema string.
     * @param model The JsonSchemaModel to convert.
     * @returns A Promise resolving to the formatted JSON Schema string.
     */
    async writeText(model: JsonSchemaModel): Promise<string> {
        const schemaObject = this.mapToJsonSchemaObject(model.schema);
        return JSON.stringify(schemaObject, null, 2); // Pretty-print with 2 spaces
    }

    /**
     * Maps a JsonSchemaDefinition object to a plain JavaScript object suitable for JSON serialization.
     * This method recursively processes properties and definitions to maintain structure.
     * @param definition The JsonSchemaDefinition object to map.
     * @returns A plain JavaScript object representing the JSON Schema.
     */
    private mapToJsonSchemaObject(definition: JsonSchemaDefinition): any {
        const obj: any = {};

        // Order of properties for consistent output
        if (definition.$schema) obj.$schema = definition.$schema;
        if (definition.$id) obj.$id = definition.$id;
        if (definition.title) obj.title = definition.title;
        if (definition.description) obj.description = definition.description;
        if (definition.type) obj.type = definition.type;
        if (definition.properties) {
            obj.properties = {};
            // Sort properties by name for consistent output
            const sortedPropertyNames = Object.keys(definition.properties).sort();
            for (const key of sortedPropertyNames) {
                obj.properties[key] = this.mapToJsonSchemaPropertyObject(definition.properties[key]);
            }
        }
        if (definition.required && definition.required.length > 0) obj.required = definition.required;
        if (definition.definitions) {
            obj.definitions = {};
            // Sort definitions by name for consistent output
            const sortedDefinitionNames = Object.keys(definition.definitions).sort();
            for (const key of sortedDefinitionNames) {
                obj.definitions[key] = this.mapToJsonSchemaObject(definition.definitions[key]);
            }
        }

        return obj;
    }

    /**
     * Maps a JsonSchemaProperty object to a plain JavaScript object suitable for JSON serialization.
     * This method handles nested properties and array items recursively.
     * @param property The JsonSchemaProperty object to map.
     * @returns A plain JavaScript object representing the JSON Schema property.
     */
    private mapToJsonSchemaPropertyObject(property: JsonSchemaProperty): any {
        if (property === null) {
            return null;
        }
        const obj: any = {};

        // Order of properties for consistent output
        if (property.type) obj.type = property.type;
        if (property.description) obj.description = property.description;
        if (property.required) obj.required = property.required;

        if (property.properties) {
            obj.properties = {};
            // Sort properties by name for consistent output
            const sortedPropertyNames = Object.keys(property.properties).sort();
            for (const key of sortedPropertyNames) {
                obj.properties[key] = this.mapToJsonSchemaPropertyObject(property.properties[key]);
            }
        }

        if (property.items) {
            obj.items = this.mapToJsonSchemaPropertyObject(property.items);
        }

        return obj;
    }
}
