import { DomainModelAdapter } from "../../data-model-api/domain-specific-model-api";
import { UniversalModel, Entity, Property, RelationshipType } from "../../data-model-api/universal-model";
import { LinkmlModel, LinkmlSchema, LinkmlClassDefinition, LinkmlSlotDefinition } from "./linkml-model";
import { toUniversalType, fromUniversalType } from "./linkml-vocabulary";

export class LinkmlAdapter implements DomainModelAdapter<LinkmlModel> {
  async toUniversalModel(linkmlModel: LinkmlModel): Promise<UniversalModel> {
    const universalModel: UniversalModel = {
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
                type: toUniversalType(slot.range || "any"),
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
                type: toUniversalType(slot.range || "any"),
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
      id: "http://example.com/linkml-schema", // Default ID
      name: universalModel.entities && universalModel.entities.length > 0 ? "my_schema" : "example_schema",
      classes: {},
    };

    if (universalModel.entities.length > 0) {
      for (const entity of universalModel.entities) {
        const linkmlClass: LinkmlClassDefinition = {
          description: entity.description || `Class for ${entity.label}`, // Use entity description or fallback
          attributes: {},
        };
        linkmlSchema.classes![entity.label] = linkmlClass;

        for (const prop of entity.properties) {
          const linkmlSlot: LinkmlSlotDefinition = {
            description: `Slot for ${prop.label}`,
            range: fromUniversalType(prop.type),
            required: true, // Assuming all properties are required for simplicity in this mock
          };
          linkmlClass.attributes![prop.label] = linkmlSlot;
        }
      }
    }

    return { schema: linkmlSchema };
  }
}
