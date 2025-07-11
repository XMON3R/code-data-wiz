import { DomainModelAdapter } from "../../data-model-api/domain-specific-model-api";
import { UniversalModel, Entity, Property } from "../../data-model-api/universal-model";
import { LinkmlModel, LinkmlSchema, LinkmlClassDefinition, LinkmlSlotDefinition } from "./linkml-model";

export class LinkmlAdapter implements DomainModelAdapter<LinkmlModel> {
  async toUniversalModel(linkmlModel: LinkmlModel): Promise<UniversalModel> {
    const universalModel: UniversalModel = {
      entities: [],
    };

    const schema = linkmlModel.schema;

    if (schema.classes) {
      for (const className in schema.classes) {
        const linkmlClass = schema.classes[className];
        const entity: Entity = {
          label: className,
          properties: [],
        };

        // Process slots defined directly within the class (attributes)
        if (linkmlClass.attributes) {
          for (const slotName in linkmlClass.attributes) {
            const slot = linkmlClass.attributes[slotName];
            const universalProperty: Property = {
              label: slotName,
              type: {
                domainSpecificType: slot.range || "any",
              },
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
                type: {
                  domainSpecificType: slot.range || "any",
                },
              };
              entity.properties.push(universalProperty);
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
      name: "example_schema", // Default name
      classes: {},
      slots: {},
    };

    if (universalModel.entities.length > 0) {
      for (const entity of universalModel.entities) {
        const linkmlClass: LinkmlClassDefinition = {
          description: `Class for ${entity.label}`,
          attributes: {},
        };
        linkmlSchema.classes![entity.label] = linkmlClass;

        for (const prop of entity.properties) {
          const linkmlSlot: LinkmlSlotDefinition = {
            description: `Slot for ${prop.label}`,
            range: prop.type.domainSpecificType,
            required: true, // Assuming all properties are required for simplicity in this mock
          };
          linkmlClass.attributes![prop.label] = linkmlSlot;
        }
      }
    }

    return { schema: linkmlSchema };
  }
}
