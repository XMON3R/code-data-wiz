import { DomainModelAdapter } from "../../data-model-api/domain-specific-model-api";
import { UniversalModel, Entity, Property, RelationshipType } from "../../data-model-api/universal-model";
import { LinkmlModel, LinkmlSchema, LinkmlClassDefinition, LinkmlSlotDefinition } from "./linkml-model";
import { toUniversalType, fromUniversalType } from "./linkml-vocabulary";

export class LinkmlAdapter implements DomainModelAdapter<LinkmlModel> {
  async toUniversalModel(linkmlModel: LinkmlModel): Promise<UniversalModel> {
    const universalModel: UniversalModel = {
      id: linkmlModel.schema.id, // Populate id from LinkmlSchema
      name: linkmlModel.schema.name, // Populate name from LinkmlSchema
      entities: [],
      relationships: [],
    };

    const schema = linkmlModel.schema;

    if (schema.classes) {
      for (const className in schema.classes) {
        const linkmlClass = schema.classes[className];
        const entity: Entity = {
          label: className,
          description: linkmlClass.description, // Preserve description
          properties: [],
        };

        // Process slots defined directly within the class (attributes)
        if (linkmlClass.attributes) {
            for (const slotName in linkmlClass.attributes) {
              // Ensure slot is not null, defaulting to an empty object if it is
              const slot = linkmlClass.attributes[slotName] || {};
              const universalProperty: Property = {
                label: slotName,
                type: toUniversalType(slot.range || schema.default_range || "any"),
                required: slot.required, // Populate required property
              };
              entity.properties.push(universalProperty);
            }
          }

        // Process slots referenced by the class from the top-level schema slots
        if (linkmlClass.slots && schema.slots) {
          for (const slotName of linkmlClass.slots) {
            const slot = schema.slots[slotName];
            if (slot) {
              const universalProperty: Property = {
                label: slotName,
                type: toUniversalType(slot.range || schema.default_range || "any"),
                required: slot.required, // Populate required property
              };
              entity.properties.push(universalProperty);

              if (slot.range && schema.classes && schema.classes[slot.range]) {
                universalModel.relationships?.push({
                  sourceEntityLabel: className,
                  targetEntityLabel: slot.range,
                  type: RelationshipType.Association,
                });
              }
            }
          }
        }
        universalModel.entities.push(entity);
      }
    }

    return universalModel;
  }

  async fromUniversalModel(universalModel: UniversalModel): Promise<LinkmlModel> {
    const linkmlSchema: LinkmlSchema = {
      id: universalModel.id || "http://example.com/linkml-schema", // Use id from UniversalModel or default
      name: universalModel.name || (universalModel.entities && universalModel.entities.length > 0 ? "my_schema" : "example_schema"), // Use name from UniversalModel or default
      classes: {},
    };

    if (universalModel.entities.length > 0) {
      for (const entity of universalModel.entities) {
          const linkmlClass: LinkmlClassDefinition = {
            description: entity.description || undefined, // Set to undefined if no description
            attributes: {},
          };
          linkmlSchema.classes![entity.label] = linkmlClass;

          for (const prop of entity.properties) {
            let isMethod = false;
            if (prop.value) {
              try {
                const propMeta = JSON.parse(prop.value);
                if (propMeta.isMethod) {
                  isMethod = true;
                }
              } catch (e) {
                // Handle potential JSON parsing errors, perhaps log them or treat as not a method
                console.error(`Failed to parse prop.value for ${prop.label}:`, e);
              }
            }

            if (isMethod) {
              continue; // Skip if it's identified as a method
            }

            const linkmlSlot: LinkmlSlotDefinition = {
              range: fromUniversalType(prop.type),
              required: false, // Default to false
            };
            linkmlClass.attributes![prop.label] = linkmlSlot;
          }
      }
    }

    return { schema: linkmlSchema };
  }
}
