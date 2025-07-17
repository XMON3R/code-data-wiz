import { CSharpDiagram, CSharpClass, CSharpType, CSharpMethod } from "./csharp-model";

/**
 * An interface for generating C# code from a CSharpDiagram.
 */
export interface CSharpWriter {
    /**
     * Generates C# code from a parsed CSharpDiagram.
     * @param parsed The CSharpDiagram object containing the C# model.
     * @returns A string representing the generated C# code.
     */
    generateCode(parsed: CSharpDiagram): string;
}

/**
 * A simple implementation of the CSharpWriter that generates basic C# class structures.
 */
export class SimpleCSharpWriter implements CSharpWriter {
    /**
     * Generates C# code for all classes in the provided CSharpDiagram.
     * @param parsed The CSharpDiagram object.
     * @returns A string containing the generated C# code for all classes.
     */
    public generateCode(parsed: CSharpDiagram): string {
        return parsed.classes.map(c => this.generateClass(c)).join("\n\n");
    }

    /**
     * Generates the C# code for a single class, including its properties and methods.
     * @param csharpClass The CSharpClass object to generate code for.
     * @returns A string representing the C# class code.
     */
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

        // Add a newline between properties and methods if both exist.
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

    /**
     * Formats a CSharpType object into a string representation, adding '?' for nullable types.
     * @param type The CSharpType to format.
     * @returns The formatted C# type string.
     */
    private formatCSharpType(type: CSharpType): string {
        let formattedType = type.name;
        if (type.isNullable) {
            formattedType += "?";
        }
        return formattedType;
    }
    
    /**
     * Generates a string representation of a C# method, including modifiers, return type, name, and parameters.
     * @param method The CSharpMethod object to generate code for.
     * @returns A string representing the C# method code.
     */
    private generateMethod(method: CSharpMethod): string {
        const modifiers: string[] = [];
        // Add access modifier unless it's the default 'internal'.
        if (method.accessModifier && method.accessModifier !== "internal") {
            modifiers.push(method.accessModifier);
        }
        if (method.isStatic) modifiers.push("static");
        if (method.isAsync) modifiers.push("async");
        if (method.isVirtual) modifiers.push("virtual");
        if (method.isOverride) modifiers.push("override");

        const returnType = this.formatCSharpType(method.returnType);
        // Format parameters: "Type name, Type name"
        const params = method.parameters.map(p => `${this.formatCSharpType(p.type)} ${p.name}`).join(', ');

        let methodCode = `    ${modifiers.join(' ')} ${returnType} ${method.name}(${params})\n`;
        methodCode += `    {\n        // Method body\n    }`; // Placeholder for method body
        return methodCode;
    }
}
