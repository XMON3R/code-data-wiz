import { DomainModelAdapter } from "../../data-model-api/domain-specific-model-api";
import { UniversalModel, Entity, Property, Method, MethodParameter } from "../../data-model-api/universal-model";
import { JavaModel, JavaClass, JavaField, JavaMethod } from "./java-model";
import { toUniversalType, fromUniversalType } from "./java-vocabulary";

/**
 * An adapter to translate between the JavaModel and the UniversalModel.
 */
export class JavaAdapter implements DomainModelAdapter<JavaModel> {

    async toUniversalModel(model: JavaModel): Promise<UniversalModel> {
        const entities: Entity[] = [];

        model.classes.forEach(cls => {
            // 1. Fields are mapped to the 'properties' array.
            const properties: Property[] = cls.fields.map(field => ({
                label: field.name,
                type: toUniversalType(field.type),
                value: JSON.stringify({
                    accessModifier: field.accessModifier,
                    isStatic: field.isStatic,
                    isFinal: field.isFinal,
                    annotations: field.annotations,
                }),
            }));

            // 2. Methods are now mapped to the 'methods' array.
            const methods: Method[] = cls.methods.map(method => ({
                label: method.name,
                returnType: toUniversalType(method.returnType),
                parameters: (method.parameters || []).map(p => ({
                    name: p.name,
                    type: toUniversalType(p.type),
                })),
                value: JSON.stringify({
                    accessModifier: method.accessModifier,
                    annotations: method.annotations,
                }),
            }));

            entities.push({
                label: cls.name,
                properties: properties,
                methods: methods, // Assign to the new methods array
                value: JSON.stringify({
                    type: cls.type,
                    accessModifier: cls.accessModifier,
                })
            });
        });
        
        // File-level metadata handling remains the same.
        // ...

        return { entities };
    }

    async fromUniversalModel(model: UniversalModel): Promise<JavaModel> {
        let packageName: string | undefined;
        let imports: string[] = [];
        const classes: JavaClass[] = [];

        model.entities.forEach(entity => {
            if (entity.label === "@javaFile") {
                // ... (file handling remains the same)
                return;
            }

            const classMeta = JSON.parse(entity.value || "{}");
            
            // 1. Reconstruct fields from the 'properties' array.
            const fields: JavaField[] = entity.properties.map(prop => {
                const fieldMeta = JSON.parse(prop.value || "{}");
                return {
                    name: prop.label,
                    type: fromUniversalType(prop.type),
                    accessModifier: fieldMeta.accessModifier || 'default',
                    isStatic: fieldMeta.isStatic,
                    isFinal: fieldMeta.isFinal,
                    annotations: fieldMeta.annotations || [],
                };
            });

            // 2. Reconstruct methods from the 'methods' array.
            const methods: JavaMethod[] = (entity.methods || []).map(method => {
                const methodMeta = JSON.parse(method.value || "{}");
                return {
                    name: method.label,
                    returnType: fromUniversalType(method.returnType),
                    parameters: (method.parameters || []).map(p => ({
                        name: p.name,
                        type: fromUniversalType(p.type),
                    })),
                    accessModifier: methodMeta.accessModifier || 'default',
                    annotations: methodMeta.annotations || [],
                };
            });

            classes.push({
                name: entity.label,
                type: classMeta.type || 'class',
                accessModifier: classMeta.accessModifier || 'default',
                fields,
                methods,
            });
        });

        return { packageName, imports, classes };
    }
}
