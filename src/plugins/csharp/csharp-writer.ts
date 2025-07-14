import { CSharpDiagram, CSharpClass, CSharpType } from "./csharp-model";

/**
 * An interface for generating C# code from a CSharpDiagram.
 */
export interface CSharpWriter {
    generateCode(parsed: CSharpDiagram): string;
}

/**
 * A simple implementation of the CSharpWriter.
 */
export class SimpleCSharpWriter implements CSharpWriter {
    public generateCode(parsed: CSharpDiagram): string {
        return parsed.classes.map(c => this.generateClass(c)).join("\n");
    }

    private generateClass(csharpClass: CSharpClass): string {
        let classCode = `public class ${csharpClass.name}\n{\n`;

        if (csharpClass.properties.length > 0) {
            const propertyDefinitions = csharpClass.properties
                .map(property => `    public ${this.formatCSharpType(property.type)} ${property.name} { get; set; }`)
                .join("\n");
            classCode += `${propertyDefinitions}\n`;
        }

        classCode += `}\n`;
        return classCode;
    }

    private formatCSharpType(type: CSharpType): string {
        let formattedType = type.name;
        if (type.isNullable) {
            formattedType += "?";
        }
        return formattedType;
    }
}