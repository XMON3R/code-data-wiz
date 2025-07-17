import { DomainModelAdapter } from "../../data-model-api/domain-specific-model-api";
import { UniversalModel, Entity, Relationship, RelationshipType, /*Property*/ } from "../../data-model-api/universal-model";
import { JavaModel, JavaClass, JavaField } from "./java-model";
import { toUniversalType, fromUniversalType } from "./java-vocabulary";

/**
 * An adapter to translate between the JavaModel and the UniversalModel.
 */
export class JavaAdapter implements DomainModelAdapter<JavaModel> {

    /**
     * Converts a JavaModel instance into the application's UniversalModel.
     * @param model The JavaModel to convert.
     * @returns A Promise that resolves with the UniversalModel representation.
     */
    async toUniversalModel(model: JavaModel): Promise<UniversalModel> {
        const entities: Entity[] = [];

        // Commented out: Working imports and packages here, but not yet resolved not to show in other plugins after translation
        /*
        // Create a "meta" entity for file-level details with a specific label
        const fileMetaProperties: Property[] = [];
        if (model.packageName) {
            fileMetaProperties.push({ label: "packageName", value: model.packageName, type: { domainSpecificType: "string"} });
        }
        if (model.imports && model.imports.length > 0) {
            fileMetaProperties.push({ label: "imports", value: JSON.stringify(model.imports), type: { domainSpecificType: "string[]" } });
        }
        if (fileMetaProperties.length > 0) {
            // Use a more specific label to avoid clashes with other plugins
            entities.push({ label: "@javaFile", properties: fileMetaProperties });
        }*/

        // Convert each Java class to a universal entity
        model.classes.forEach(cls => {
            const properties = cls.fields.map(field => ({
                label: field.name,
                type: toUniversalType(field.type),
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

        const relationships: Relationship[] = [];
        model.classes.forEach(cls => {
            cls.fields.forEach(field => {
                // If a field type is one of the classes in the model, it's a relationship
                if (model.classes.some(c => c.name === field.type)) {
                    relationships.push({
                        sourceEntityLabel: cls.name,
                        targetEntityLabel: field.type,
                        type: RelationshipType.Association, // Defaulting to Association
                    });
                }
            });
        });

        return { entities, relationships };
    }

    /**
     * Converts the application's UniversalModel into a JavaModel.
     * @param model The UniversalModel to convert.
     * @returns A Promise that resolves with the JavaModel representation.
     */
    async fromUniversalModel(model: UniversalModel): Promise<JavaModel> {
        // Commented out: packageName and imports are not currently processed.
        /*
        let packageName: string | undefined;
        let imports: string[] = [];
        */
        const classes: JavaClass[] = [];

        model.entities.forEach(entity => {
            // Check for the specific @javaFile label --- placeholder for now
            /*
            if (entity.label === "@javaFile") {
                packageName = entity.properties.find(p => p.label === "packageName")?.value;
                const importsProp = entity.properties.find(p => p.label === "imports");
                if (importsProp?.value) {
                    imports = JSON.parse(importsProp.value);
                }
                return; // Continue to the next entity
            }*/

            const classMeta = entity.value ? JSON.parse(entity.value) : {};
            const fields: JavaField[] = entity.properties.map(prop => {
                const fieldMeta = prop.value ? JSON.parse(prop.value) : {};
                
                const field: JavaField = {
                    name: prop.label,
                    type: fromUniversalType(prop.type),
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
                methods: [], // Methods are not currently processed from UniversalModel
            });
        });

        return { /*packageName, imports,*/ classes };
    }
}
