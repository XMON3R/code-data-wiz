import {
    UniversalModel,
    Entity,
    Property,
} from "../../data-model-api/universal-model";
import {
    DomainModelAdapter,
} from "../../data-model-api/domain-specific-model-api";
import { CSharpModel, CSharpClass, CSharpProperty } from "./csharp-model";
import { toUniversalType, fromUniversalType } from "./csharp-vocabulary";

/**
 * An adapter to translate between the CSharpModel and the UniversalModel,
 * inspired by a detailed, metadata-preserving approach.
 */
export class CSharpAdapter implements DomainModelAdapter<CSharpModel> {
    async toUniversalModel(model: CSharpModel): Promise<UniversalModel> {
        const entities: Entity[] = model.classes.map(cls => {
            const properties: Property[] = cls.properties.map(prop => ({
                label: prop.name,
                type: toUniversalType(prop.type.name),
                value: JSON.stringify({
                    accessModifier: prop.accessModifier,
                    isNullable: prop.type.isNullable || false,
                }),
            }));

            return {
                label: cls.name,
                properties: properties,
                // Store class-specific metadata in the 'value' field as a JSON string.
                value: JSON.stringify({
                    type: cls.type,
                    accessModifier: cls.accessModifier,
                }),
            };
        });

        return { entities };
    }

    async fromUniversalModel(model: UniversalModel): Promise<CSharpModel> {
        const classes: CSharpClass[] = model.entities.map(entity => {
            // Skip any file-level metadata entities, if they were to be added.
            if (entity.label === "@file") {
                return null;
            }

            const classMeta = entity.value ? JSON.parse(entity.value) : {};
            const properties: CSharpProperty[] = entity.properties.map(prop => {
                const propMeta = prop.value ? JSON.parse(prop.value) : {};
                return {
                    name: prop.label,
                    type: {
                        name: fromUniversalType(prop.type),
                        isNullable: propMeta.isNullable,
                    },
                    accessModifier: propMeta.accessModifier || "public",
                };
            });

            return {
                name: entity.label,
                type: classMeta.type || "class",
                accessModifier: classMeta.accessModifier || "public",
                properties: properties,
                methods: [], // Methods are not part of this conversion.
            };
        }).filter(Boolean) as CSharpClass[]; // Filter out any nulls.

        return { classes };
    }
}
