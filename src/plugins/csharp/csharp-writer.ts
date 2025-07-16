import { CSharpDiagram, CSharpClass, CSharpType, CSharpMethod } from "./csharp-model";

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
        return parsed.classes.map(c => this.generateClass(c)).join("\n\n");
    }

    private generateClass(csharpClass: CSharpClass): string {
        let classCode = `${csharpClass.accessModifier || 'public'} class ${csharpClass.name}\n{\n`;

        if (csharpClass.properties.length > 0) {
            const propertyDefinitions = csharpClass.properties
                .map(property => {
                    const modifier = property.accessModifier ? `${property.accessModifier} ` : 'public ';
                    const setter = property.isReadonly ? '' : 'set; ';
                    return `    ${modifier}${this.formatCSharpType(property.type)} ${property.name} { get; ${setter}}`;
                })
                .join("\n");
            classCode += `${propertyDefinitions}\n`;
        }

        // --- FIX IS HERE ---
        // Add a newline if there are properties AND methods
        if (csharpClass.properties.length > 0 && csharpClass.methods.length > 0) {
            classCode += "\n";
        }

        if (csharpClass.methods.length > 0) {
            const methodDefinitions = csharpClass.methods
                .map(method => this.generateMethod(method))
                .join("\n\n");
            classCode += `${methodDefinitions}\n`;
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
    
    /**
     * Generates a string representation of a C# method.
     */
    private generateMethod(method: CSharpMethod): string {
        const modifiers: string[] = [];
        if (method.accessModifier && method.accessModifier !== "internal") {
            modifiers.push(method.accessModifier);
        }
        if (method.isStatic) modifiers.push("static");
        if (method.isAsync) modifiers.push("async");
        if (method.isVirtual) modifiers.push("virtual");
        if (method.isOverride) modifiers.push("override");

        const returnType = this.formatCSharpType(method.returnType);
        const params = method.parameters.map(p => `${this.formatCSharpType(p.type)} ${p.name}`).join(', ');

        let methodCode = `    ${modifiers.join(' ')} ${returnType} ${method.name}(${params})\n`;
        methodCode += `    {\n        // Method body\n    }`;
        return methodCode;
    }
}