import { UniversalModel,Entity, Property, Relationship, RelationshipType, } from "../../data-model-api/universal-model";
import { OfnModel, OfnModelConcept } from "./ofn-model";
import { DomainModelAdapter } from "../../data-model-api/domain-specific-model-api";
import { ofnKeyMap, inverseOfnKeyMap } from "./ofn-vocabulary";

/**
 * An adapter to translate between the OfnModel (with English keys) and the UniversalModel.
 * It maps OFN concepts and vocabulary properties to UniversalModel entities and properties.
 */
export class OfnAdapter implements DomainModelAdapter<OfnModel> {
  /**
   * Converts the domain-specific OfnModel (with English keys) into the UniversalModel.
   * This involves mapping OFN vocabulary properties to the main entity and OFN concepts to separate entities.
   * @param model The OfnModel to convert.
   * @returns A Promise that resolves with the UniversalModel representation.
   */
  async toUniversalModel(model: OfnModel): Promise<UniversalModel> {
    const entities: Entity[] = [];
    const relationships: Relationship[] = [];

    // Create a main entity for the vocabulary itself
    const vocabularyEntity: Entity = {
      label: "OFN Vocabulary", // A fixed label for the main entity
      properties: [],
    };

    // Map top-level OFN vocabulary properties to properties of the "OFN Vocabulary" entity.
    for (const key in model) {
      if (
        key !== "concepts" &&
        Object.prototype.hasOwnProperty.call(model, key) &&
        ofnKeyMap[key]
      ) {
        const value = model[key as keyof OfnModel];
        const czechKey = ofnKeyMap[key];
        vocabularyEntity.properties.push({
          label: czechKey,
          type: { domainSpecificType: typeof value },
          value: typeof value === "object" ? JSON.stringify(value) : String(value ?? ""),
        });
      }
    }
    entities.push(vocabularyEntity);

    // Create entities for each concept
    if (model.concepts) {
      model.concepts.forEach((concept: OfnModelConcept) => {
        const properties: Property[] = [];
        for (const key in concept) {
          if (Object.prototype.hasOwnProperty.call(concept, key)) {
            const value = concept[key as keyof OfnModelConcept];

            if (key === "name" || key === "definition") {
              // Handle nested 'name' and 'definition' objects which contain language-specific values.
              if (typeof value === "object" && value !== null) {
                for (const langKey in value) {
                  if (Object.prototype.hasOwnProperty.call(value, langKey)) {
                    const nestedValue = (value as any)[langKey];
                    const czechKey = ofnKeyMap[`concepts.${key}.${langKey}`];
                    if (czechKey) {
                      properties.push({
                        label: czechKey,
                        type: { domainSpecificType: typeof nestedValue },
                        value: String(nestedValue ?? ""),
                      });
                    }
                  }
                }
              }
            } else {
              // Handle other direct properties of the concept.
              const czechKey = ofnKeyMap[`concepts.${key}`] || key;
              properties.push({
                label: czechKey,
                type: { domainSpecificType: typeof value },
                value: typeof value === "object" ? JSON.stringify(value) : String(value ?? ""),
              });
            }
          }
        }
        entities.push({
          label: concept.name?.en || concept.name?.cs || concept.iri || "Unnamed Concept",
          properties: properties,
        });

        // Create relationships based on concept's subclassOf and domain/range properties.
        if (concept.subClassOf) {
          concept.subClassOf.forEach((superClass) => {
            relationships.push({
              sourceEntityLabel: concept.name?.en || concept.name?.cs || concept.iri || "Unnamed Concept",
              targetEntityLabel: superClass,
              type: RelationshipType.Inheritance,
            });
          });
        }
        if (concept.domain && concept.range) {
          relationships.push({
            sourceEntityLabel: concept.domain,
            targetEntityLabel: concept.range,
            type: RelationshipType.Association,
            label: concept.name?.en || concept.name?.cs,
          });
        }
      });
    }

    return { entities, relationships };
  }

  /**
   * Converts the UniversalModel back into an OfnModel.
   * This involves mapping UniversalModel entities and properties back to OFN concepts and vocabulary.
   * @param mainModel The UniversalModel to convert.
   * @returns A Promise that resolves with the OfnModel representation.
   */
  async fromUniversalModel(mainModel: UniversalModel): Promise<OfnModel> {
    const ofnData: OfnModel = {
      name: { en: "Converted from Universal Model" },
      description: { en: "This model was generated from a UniversalModel." },
      concepts: [],
      context: undefined,
      iri: undefined,
      type: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    };

    if (mainModel.entities) {
      const vocabularyEntity = mainModel.entities.find((e) => e.label === "OFN Vocabulary");
      if (vocabularyEntity && vocabularyEntity.properties) {
        // Helper function to get property value from the vocabulary entity.
        const getPropValue = (label: string) => {
          const prop = vocabularyEntity.properties.find((p) => p.label === label);
          if (!prop) return undefined;
          let value = (prop as any).value;
          if (typeof value === "string" && (value.startsWith("{") || value.startsWith("["))) {
            try {
              value = JSON.parse(value);
            } catch {
              // Not a JSON string, use as is.
            }
          }
          return value;
        };

        // Map vocabulary properties to OfnModel fields.
        ofnData.context = getPropValue("@context");
        ofnData.iri = getPropValue("iri");
        ofnData.type = getPropValue("typ");
        ofnData.name = getPropValue("název");
        ofnData.description = getPropValue("popis");
        ofnData.createdAt = getPropValue("vytvořeno");
        ofnData.updatedAt = getPropValue("aktualizováno");
      }

      // Filter out the vocabulary entity and process the remaining entities as concepts.
      const conceptEntities = mainModel.entities.filter((e) => e.label !== "OFN Vocabulary");
      ofnData.concepts = conceptEntities.map((entity) => {
        const concept: Partial<OfnModelConcept> = {};
        if (entity.properties) {
          entity.properties.forEach((prop) => {
            const czechKey = prop.label;
            let value = (prop as any).value;
            const englishKey = inverseOfnKeyMap[czechKey];

            if (englishKey) {
              if (typeof value === "string" && (value.startsWith("{") || value.startsWith("["))) {
                try {
                  value = JSON.parse(value);
                } catch {
                  // Not a JSON string, use as is.
                }
              }

              const parts = englishKey.split(".");
              if (parts.length === 3 && parts[0] === "concepts") {
                const parentKey = parts[1];
                const nestedKey = parts[2];
                if (!(concept as any)[parentKey]) {
                  (concept as any)[parentKey] = {};
                }
                (concept as any)[parentKey][nestedKey] = value;
              } else if (parts.length === 2 && parts[0] === "concepts") {
                (concept as any)[parts[1]] = value;
              } else {
                (concept as any)[englishKey] = value;
              }
            }
          });
        }
        return concept as OfnModelConcept;
      });
    }

    return ofnData as OfnModel;
  }
}
