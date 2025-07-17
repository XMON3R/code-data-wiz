import { UniversalModel, Entity, Property, Relationship, RelationshipType } from "../../data-model-api/universal-model";
import { OfnModel, OfnModelConcept } from "./ofn-model";
import { DomainModelAdapter } from "../../data-model-api/domain-specific-model-api";
import { ofnKeyMap, inverseOfnKeyMap } from "./ofn-vocabulary";

export class OfnAdapter implements DomainModelAdapter<OfnModel> {

    /**
     * Converts the domain-specific OfnModel (with English keys) into the UniversalModel.
     */
    async toUniversalModel(model: OfnModel): Promise<UniversalModel> {
        const entities: Entity[] = [];
        const relationships: Relationship[] = [];

        // Create a main entity for the vocabulary itself
        const vocabularyEntity: Entity = {
            label: "OFN Vocabulary", // A fixed label for the main entity
            properties: [],
        };

        for (const key in model) {
            if (key !== 'concepts' && Object.prototype.hasOwnProperty.call(model, key) && ofnKeyMap[key]) {
                const value = model[key as keyof OfnModel];
                const czechKey = ofnKeyMap[key];
                vocabularyEntity.properties.push({
                    label: czechKey,
                    type: { domainSpecificType: typeof value },
                    value: typeof value === 'object' ? JSON.stringify(value) : String(value ?? ''),
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

                        if (key === 'name' || key === 'definition') {
                            // Handle nested 'name' and 'definition' objects
                            if (typeof value === 'object' && value !== null) {
                                for (const langKey in value) {
                                    if (Object.prototype.hasOwnProperty.call(value, langKey)) {
                                        const nestedValue = (value as any)[langKey];
                                        const czechKey = ofnKeyMap[`concepts.${key}.${langKey}`];
                                        if (czechKey) {
                                            properties.push({
                                                label: czechKey,
                                                type: { domainSpecificType: typeof nestedValue },
                                                value: String(nestedValue ?? ''),
                                            });
                                        }
                                    }
                                }
                            }
                        } else {
                            // Handle other direct properties
                            const czechKey = ofnKeyMap[`concepts.${key}`] || key;
                            properties.push({
                                label: czechKey,
                                type: { domainSpecificType: typeof value },
                                value: typeof value === 'object' ? JSON.stringify(value) : String(value ?? ''),
                            });
                        }
                    }
                }
                entities.push({
                    label: concept.name?.en || concept.name?.cs || concept.iri || "Unnamed Concept",
                    properties: properties,
                });

                // Create relationships
                if (concept.subClassOf) {
                    concept.subClassOf.forEach(superClass => {
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
     */
    async fromUniversalModel(mainModel: UniversalModel): Promise<OfnModel> {
        const ofnData: OfnModel = { // Initialize as OfnModel with default values for required properties
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
            const vocabularyEntity = mainModel.entities.find(e => e.label === "OFN Vocabulary");
            if (vocabularyEntity && vocabularyEntity.properties) {
                const getPropValue = (label: string) => {
                    const prop = vocabularyEntity.properties.find(p => p.label === label);
                    if (!prop) return undefined;
                    let value = (prop as any).value;
                    if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
                        try {
                            value = JSON.parse(value);
                        } catch (e) {
                            // Not a JSON string, use as is
                        }
                    }
                    return value;
                };

                ofnData.context = getPropValue("@context");
                ofnData.iri = getPropValue("iri");
                ofnData.type = getPropValue("typ");
                ofnData.name = getPropValue("název");
                ofnData.description = getPropValue("popis");
                ofnData.createdAt = getPropValue("vytvořeno");
                ofnData.updatedAt = getPropValue("aktualizováno");
            }

            const conceptEntities = mainModel.entities.filter(e => e.label !== "OFN Vocabulary");
            ofnData.concepts = conceptEntities.map(entity => {
                const concept: Partial<OfnModelConcept> = {};
                if (entity.properties) {
                    entity.properties.forEach(prop => {
                        const czechKey = prop.label;
                        let value = (prop as any).value;
                        const englishKey = inverseOfnKeyMap[czechKey];

                        if (englishKey) {
                            if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
                                try {
                                    value = JSON.parse(value);
                                } catch (e) {
                                    // Not a JSON string, use as is
                                }
                            }

                            const parts = englishKey.split('.');
                            if (parts.length === 3 && parts[0] === 'concepts') {
                                // Handle nested properties like "concepts.name.cs"
                                const parentKey = parts[1];
                                const nestedKey = parts[2];
                                if (!(concept as any)[parentKey]) {
                                    (concept as any)[parentKey] = {};
                                }
                                (concept as any)[parentKey][nestedKey] = value;
                            } else if (parts.length === 2 && parts[0] === 'concepts') {
                                // Handle direct concept properties like "concepts.iri"
                                (concept as any)[parts[1]] = value;
                            } else {
                                // Handle top-level properties if any, though current logic focuses on concepts
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
