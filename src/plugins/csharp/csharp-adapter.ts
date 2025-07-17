import {
    UniversalModel,
    Entity,
    Property,
    Relationship,
    RelationshipType,
} from "../../data-model-api/universal-model";
import {
    DomainModelAdapter,
} from "../../data-model-api/domain-specific-model-api";
import { CSharpModel, CSharpClass, CSharpProperty, CSharpMethod } from "./csharp-model";
import { toUniversalType, fromUniversalType } from "./csharp-vocabulary";

/**
 * An adapter to translate between the CSharpModel and the UniversalModel.
 */
export class CSharpAdapter implements DomainModelAdapter<CSharpModel> {
    async toUniversalModel(model: CSharpModel): Promise<UniversalModel> {
        const entities: Entity[] = model.classes.map(cls => {
            const properties: Property[] = cls.properties.map(prop => ({
                label: prop.name,
                type: toUniversalType(prop.type.name),
                value: JSON.stringify({
                    isProperty: true, // Add a flag to distinguish from methods
                    accessModifier: prop.accessModifier,
                    isNullable: prop.type.isNullable || false,
                    isReadonly: prop.isReadonly || false,
                }),
            }));
            
            // Convert methods into universal properties as well
            const methodsAsProperties: Property[] = cls.methods.map(method => ({
                label: method.name,
                type: toUniversalType(method.returnType.name),
                value: JSON.stringify({
                    isMethod: true, // Flag to identify this as a method
                    parameters: method.parameters,
                    accessModifier: method.accessModifier,
                    isStatic: method.isStatic,
                    isAsync: method.isAsync,
                    isVirtual: method.isVirtual,
                    isOverride: method.isOverride,
                }),
            }));

            return {
                label: cls.name,
                properties: [...properties, ...methodsAsProperties], // Combine properties and methods
                value: JSON.stringify({
                    type: cls.type,
                    accessModifier: cls.accessModifier,
                }),
            };
        });

        const relationships: Relationship[] = [];
        model.classes.forEach(cls => {
            cls.properties.forEach(prop => {
                // If a property type is one of the classes in the model, it's a relationship
                if (model.classes.some(c => c.name === prop.type.name)) {
                    relationships.push({
                        sourceEntityLabel: cls.name,
                        targetEntityLabel: prop.type.name,
                        type: RelationshipType.Association, // Defaulting to Association
                    });
                }
            });
        });

        return { entities, relationships };
    }

    async fromUniversalModel(model: UniversalModel): Promise<CSharpModel> {
        const classes: CSharpClass[] = model.entities.map(entity => {
            if (entity.label === "@file") return null;

            const classMeta = entity.value ? JSON.parse(entity.value) : {};
            const properties: CSharpProperty[] = [];
            const methods: CSharpMethod[] = [];

            // Differentiate between properties and methods when converting back
            entity.properties.forEach(prop => {
                const propMeta = prop.value ? JSON.parse(prop.value) : {};

                if (propMeta.isMethod) {
                    methods.push({
                        name: prop.label,
                        returnType: { name: fromUniversalType(prop.type) },
                        parameters: propMeta.parameters || [],
                        accessModifier: propMeta.accessModifier || "public",
                        isStatic: propMeta.isStatic,
                        isAsync: propMeta.isAsync,
                        isVirtual: propMeta.isVirtual,
                        isOverride: propMeta.isOverride,
                    });
                } else {
                    properties.push({
                        name: prop.label,
                        type: {
                            name: fromUniversalType(prop.type),
                            isNullable: propMeta.isNullable,
                        },
                        accessModifier: propMeta.accessModifier || "public",
                        isReadonly: propMeta.isReadonly,
                    });
                }
            });

            return {
                name: entity.label,
                type: classMeta.type || "class",
                accessModifier: classMeta.accessModifier || "public",
                properties,
                methods,
            };
        }).filter(Boolean) as CSharpClass[];

        return { classes };
    }
}
