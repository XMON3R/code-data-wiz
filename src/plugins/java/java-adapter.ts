import { DomainModelAdapter } from "../../data-model-api/domain-specific-model-api";
import { UniversalModel, Entity, Property } from "../../data-model-api/universal-model";
import { JavaModel, JavaClass, JavaField } from "./java-model";

/**
 * An adapter to translate between the JavaModel and the UniversalModel.
 */
export class JavaAdapter implements DomainModelAdapter<JavaModel> {

    async toUniversalModel(model: JavaModel): Promise<UniversalModel> {
        const entities: Entity[] = [];

        // Create a "meta" entity for file-level details
        const fileMetaProperties: Property[] = [];
        if (model.packageName) {
            fileMetaProperties.push({ label: "packageName", value: model.packageName, type: { domainSpecificType: "string"} });
        }
        if (model.imports && model.imports.length > 0) {
            fileMetaProperties.push({ label: "imports", value: JSON.stringify(model.imports), type: { domainSpecificType: "string[]" } });
        }
        if (fileMetaProperties.length > 0) {
            // Add a 'value' field to indicate it's metadata, so other models can potentially ignore it.
            entities.push({ label: "@file", properties: fileMetaProperties, value: JSON.stringify({ type: "javaFileMetadata" }) });
        }

        // Convert each Java class to a universal entity
        model.classes.forEach(cls => {
            const properties = cls.fields.map(field => ({
                label: field.name,
                type: { domainSpecificType: field.type },
                value: JSON.stringify({
                    accessModifier: field.accessModifier,
                    isStatic: field.isStatic,
                    isFinal: field.isFinal,
                    annotations: field.annotations,
                }),
            }));

            entities.push({
                label: cls.name,
                properties: properties,
                value: JSON.stringify({
                    type: cls.type,
                    accessModifier: cls.accessModifier,
                })
            });
        });

        return { entities };
    }

    async fromUniversalModel(model: UniversalModel): Promise<JavaModel> {
        let packageName: string | undefined;
        let imports: string[] = [];
        const classes: JavaClass[] = [];

        model.entities.forEach(entity => {
            if (entity.label === "@file") {
                packageName = entity.properties.find(p => p.label === "packageName")?.value;
                const importsProp = entity.properties.find(p => p.label === "imports");
                if (importsProp?.value) {
                    imports = JSON.parse(importsProp.value);
                }
                return;
            }

            const classMeta = entity.value ? JSON.parse(entity.value) : {};
            const fields: JavaField[] = entity.properties.map(prop => {
                const fieldMeta = prop.value ? JSON.parse(prop.value) : {};
                
                // FIX: Conditionally add boolean properties only if they are true.
                // This prevents adding 'isStatic: false' to the final object.
                const field: JavaField = {
                    name: prop.label,
                    type: prop.type.domainSpecificType,
                    accessModifier: fieldMeta.accessModifier || 'default',
                    ...(fieldMeta.isStatic && { isStatic: true }),
                    ...(fieldMeta.isFinal && { isFinal: true }),
                    annotations: fieldMeta.annotations || [],
                };
                return field;
            });

            classes.push({
                name: entity.label,
                type: classMeta.type || 'class',
                accessModifier: classMeta.accessModifier || 'default',
                fields: fields,
                methods: [],
            });
        });

        return { packageName, imports, classes };
    }
}
