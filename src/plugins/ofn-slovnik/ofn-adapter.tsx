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
                    if (Object.prototype.hasOwnProperty.call(concept, key) && ofnKeyMap[`concepts.${key}`]) {
                        const value = concept[key as keyof OfnModelConcept];
                        const czechKey = ofnKeyMap[`concepts.${key}`];
                        properties.push({
                            label: czechKey,
                            type: { domainSpecificType: typeof value },
                            value: typeof value === 'object' ? JSON.stringify(value) : String(value ?? ''),
                        });
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
        const ofnData: Partial<OfnModel> = {
            concepts: [],
        };

        if (mainModel.entities) {
            // The first entity is assumed to be the main vocabulary entity
            const vocabularyEntity = mainModel.entities.find(e => e.label === "OFN Vocabulary");
            if (vocabularyEntity && vocabularyEntity.properties) {
                vocabularyEntity.properties.forEach(prop => {
                    const czechKey = prop.label;
                    const value = (prop as any).value;
                    const englishKey = inverseOfnKeyMap[czechKey];

                    if (englishKey) {
                        try {
                            const parsedValue = JSON.parse(value);
                            (ofnData as any)[englishKey] = parsedValue;
                        } catch (e) {
                            (ofnData as any)[englishKey] = value;
                        }
                    }
                });
            }

            // The rest of the entities are concepts
            ofnData.concepts = mainModel.entities
                .filter(e => e.label !== "OFN Vocabulary")
                .map(entity => {
                    const concept: Partial<OfnModelConcept> = {};
                    if (entity.properties) {
                        entity.properties.forEach(prop => {
                            const czechKey = prop.label;
                            const value = (prop as any).value;
                            const englishKey = inverseOfnKeyMap[czechKey];

                            if (englishKey) {
                                try {
                                    const parsedValue = JSON.parse(value);
                                    (concept as any)[englishKey.replace('concepts.', '')] = parsedValue;
                                } catch (e) {
                                    (concept as any)[englishKey.replace('concepts.', '')] = value;
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
