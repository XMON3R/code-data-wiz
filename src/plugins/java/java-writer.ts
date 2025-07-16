import { DomainTextWriter } from "../../data-model-api/domain-specific-model-api";
import { JavaModel, JavaClass, JavaField, JavaMethod } from "./java-model";

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
        const modifier = cls.accessModifier === 'default' ? '' : `${cls.accessModifier} `;
        let classContent = `${modifier}${cls.type} ${cls.name} {\n`;

        if (cls.fields && cls.fields.length > 0) {
            classContent += cls.fields.map(f => this.writeField(f)).join('\n\n') + '\n';
        }

        // --- FIX IS HERE ---
        // Add method generation logic
        if (cls.methods && cls.methods.length > 0) {
             if (cls.fields.length > 0) classContent += '\n'; // Add separator
             classContent += cls.methods.map(m => this.writeMethod(m)).join('\n\n') + '\n';
        }

        classContent += "}";
        return classContent;
    }

    private writeField(field: JavaField): string {
        const annotations = (field.annotations || []).map(a => `    @${a.name}`).join('\n');
        const modifier = field.accessModifier === 'default' ? '' : `${field.accessModifier} `;
        const staticMod = field.isStatic ? 'static ' : '';
        const finalMod = field.isFinal ? 'final ' : '';
        const line = `    ${modifier}${staticMod}${finalMod}${field.type} ${field.name};`;
        
        return (annotations ? annotations + '\n' : '') + line;
    }

    /**
     * Generates a string representation of a Java method.
     */
    private writeMethod(method: JavaMethod): string {
        const annotations = (method.annotations || []).map(a => `    @${a.name}`).join('\n');
        const modifier = method.accessModifier === 'default' ? '' : `${method.accessModifier} `;
        const params = (method.parameters || []).map(p => `${p.type} ${p.name}`).join(', ');
        
        let methodCode = `    ${modifier}${method.returnType} ${method.name}(${params}) {\n`;
        methodCode += `        // Method body\n    }`;

        return (annotations ? annotations + '\n' : '') + methodCode;
    }
}
