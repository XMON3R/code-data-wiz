import { DomainModelAdapter } from "../../data-model-api/domain-specific-model-api";
import { UniversalModel, Entity, Property } from "../../data-model-api/universal-model";
import { JsonSchemaModel, JsonSchemaDefinition, JsonSchemaProperty } from "./json-schema-model";
import { toUniversalType, fromUniversalType } from "./json-schema-vocabulary";

export class JsonSchemaAdapter implements DomainModelAdapter<JsonSchemaModel> {
  async toUniversalModel(jsonSchemaModel: JsonSchemaModel): Promise<UniversalModel> {
    const universalModel: UniversalModel = {
      entities: [],
    };

    const schema = jsonSchemaModel.schema;

    if (schema.type === "object" && schema.properties) {
      const entity: Entity = {
        label: schema.title || "Root",
        properties: [],
      };

      for (const key in schema.properties) {
        const prop = schema.properties[key];
        const universalProperty: Property = {
          label: key,
          type: toUniversalType(Array.isArray(prop.type) ? prop.type.join(" | ") : prop.type || "any"),
        };
        if (prop.format) {
          universalProperty.type.format = prop.format;
        }
        entity.properties.push(universalProperty);
      }
      universalModel.entities.push(entity);
    }
    // Handle other schema types (array, string, number, etc.) or multiple definitions if needed

    return universalModel;
  }

  async fromUniversalModel(universalModel: UniversalModel): Promise<JsonSchemaModel> {
    const jsonSchemaDefinition: JsonSchemaDefinition = {
      $schema: "http://json-schema.org/draft-07/schema#",
      title: "Root",
      type: "object",
      properties: {},
      required: [],
    };

    if (universalModel.entities.length > 0) {
      const mainEntity = universalModel.entities[0]; // Assuming the first entity is the main schema object
      jsonSchemaDefinition.title = mainEntity.label;

      for (const prop of mainEntity.properties) {
        const jsonSchemaProperty: JsonSchemaProperty = {
          name: prop.label,
          type: fromUniversalType(prop.type),
          format: prop.type.format, // Map format from UniversalModel back to JSON Schema
        };
        if (jsonSchemaDefinition.properties) {
          jsonSchemaDefinition.properties[prop.label] = jsonSchemaProperty;
        }
        // Assuming all properties are required for simplicity in this mock
        if (jsonSchemaDefinition.required) {
          jsonSchemaDefinition.required.push(prop.label);
        }
      }
    }

    return { schema: jsonSchemaDefinition };
  }
}
