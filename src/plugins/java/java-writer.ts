import { DomainTextWriter } from "../../data-model-api/domain-specific-model-api";
import { JavaModel, JavaClass, JavaField } from "./java-model";

/**
 * A writer that converts a JavaModel object into a formatted Java code string.
 */
export class JavaWriter implements DomainTextWriter<JavaModel> {
    async writeText(model: JavaModel): Promise<string> {
        if (!model) return "";

        const parts: string[] = [];

        if (model.packageName) {
            parts.push(`package ${model.packageName};\n`);
        }

        if (model.imports && model.imports.length > 0) {
            parts.push(model.imports.map(i => `import ${i};`).join('\n') + '\n');
        }

        if (model.classes && model.classes.length > 0) {
            parts.push(model.classes.map(c => this.writeClass(c)).join('\n\n'));
        }

        return parts.join('\n');
    }

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

    private writeField(field: JavaField): string {
        const fieldParts: string[] = [];
        
        if (field.annotations && field.annotations.length > 0) {
            fieldParts.push(field.annotations.map(a => `    @${a.name}`).join('\n'));
        }

        const modifier = field.accessModifier === 'default' ? '' : `${field.accessModifier} `;
        const staticMod = field.isStatic ? 'static ' : '';
        const finalMod = field.isFinal ? 'final ' : '';
        
        const line = `    ${modifier}${staticMod}${finalMod}${field.type} ${field.name};`;
        fieldParts.push(line);

        return fieldParts.join('\n');
    }
}
