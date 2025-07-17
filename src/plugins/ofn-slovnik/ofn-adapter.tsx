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
                        const czechKey = ofnKeyMap[`concepts.${key}`] || key;
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
        const ofnData: Partial<OfnModel> = {};

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
                            (concept as any)[englishKey.replace('concepts.', '')] = value;
                        }
                    });
                }
                return concept as OfnModelConcept;
            });
        }

        return ofnData as OfnModel;
    }
}
