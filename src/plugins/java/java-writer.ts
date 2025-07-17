import { DomainTextWriter } from "../../data-model-api/domain-specific-model-api";
import { JavaModel, JavaClass, JavaField } from "./java-model";

/**
 * A writer that converts a JavaModel object into a formatted Java code string.
 */
export class JavaWriter implements DomainTextWriter<JavaModel> {
    /**
     * Converts a JavaModel object into a Java code string.
     * @param model The JavaModel to convert.
     * @returns A Promise resolving to the formatted Java code string.
     */
    async writeText(model: JavaModel): Promise<string> {
        if (!model) return "";

        const parts: string[] = [];

        // Commented out: Package and import writing logic.
        /*
        if (model.packageName) {
            parts.push(`package ${model.packageName};\n`);
        }

        if (model.imports && model.imports.length > 0) {
            parts.push(model.imports.map(i => `import ${i};`).join('\n') + '\n');
        }*/

        if (model.classes && model.classes.length > 0) {
            parts.push(model.classes.map(c => this.writeClass(c)).join('\n\n'));
        }

        return parts.join('\n');
    }

    /**
     * Writes the C# code for a single class, including its fields and annotations.
     * @param cls The JavaClass object to write.
     * @returns A string representing the Java class code.
     */
    private writeClass(cls: JavaClass): string {
        const classParts: string[] = [];
        const modifier = cls.accessModifier === 'default' ? '' : `${cls.accessModifier} `;
        classParts.push(`${modifier}${cls.type} ${cls.name} {`);

        if (cls.fields && cls.fields.length > 0) {
            classParts.push(cls.fields.map(f => `\n${this.writeField(f)}`).join(''));
        }

        classParts.push("\n}");
        return classParts.join('');
    }

    /**
     * Writes the Java code for a single field, including its modifiers, type, name, and annotations.
     * @param field The JavaField object to write.
     * @returns A string representing the Java field code.
     */
    private writeField(field: JavaField): string {
        const fieldParts: string[] = [];
        
        if (field.annotations && field.annotations.length > 0) {
            fieldParts.push(field.annotations.map(a => `    @${a.name}`).join('\n'));
        }

        const modifier = field.accessModifier === 'default' ? '' : `${field.accessModifier} `;
        const staticMod = field.isStatic ? 'static ' : '';
        const finalMod = field.isFinal ? 'final ' : '';
        
        // Re-applying the fix for static final fields
        let line = `    ${modifier}${staticMod}${finalMod}${field.type} ${field.name}`;
        if (field.isStatic && field.isFinal) {
            line += " = null"; // Initialize static final fields
        }
        line += ";";
        fieldParts.push(line);

        return fieldParts.join('\n');
    }
}
