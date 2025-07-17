import { DomainTextParser } from "../../data-model-api/domain-specific-model-api";
import { CSharpModel, CSharpClass, CSharpProperty, CSharpMethod, CSharpParameter, CSharpClassType } from "./csharp-model";

/**
 * Parses C# code strings into a structured CSharpModel.
 * This parser is designed to handle classes, properties, and methods,
 * distinguishing between properties with getters/setters and methods.
 */
export class CSharpTextParser implements DomainTextParser<CSharpModel> {
    /**
     * Parses a C# code string into a CSharpModel.
     * @param csharpString The C# code as a string.
     * @returns A Promise resolving to the CSharpModel.
     * @throws Error if the C# code has mismatched curly braces.
     */
    async parseText(csharpString: string): Promise<CSharpModel> {
        // Basic validation for curly brace balance.
        if ((csharpString.match(/{/g) || []).length !== (csharpString.match(/}/g) || []).length) {
            throw new Error("Failed to parse C# source code: Mismatched curly braces.");
        }
        return { classes: this.parseClasses(csharpString) };
    }

    /**
     * Parses C# classes from the provided string.
     * It extracts class definitions, their access modifiers, names, and content.
     * @param csharpString The string containing C# code.
     * @returns An array of CSharpClass objects.
     */
    private parseClasses(csharpString: string): CSharpClass[] {
        const classes: CSharpClass[] = [];
        // Regex to capture class definitions: access modifier, class keyword, name, and content within braces.
        const classRegex = /(public|private|protected|internal)?\s*class\s+(\w+)\s*{((?:[^{}]*|{(?:[^{}]*|{[^{}]*})*})*)}/gs;
        let classMatch: RegExpExecArray | null;

        while ((classMatch = classRegex.exec(csharpString)) !== null) {
            const accessModifier = classMatch[1] || "internal";
            const className = classMatch[2];
            let classContent = classMatch[3];

            // First, parse methods from the raw class content.
            const methods = this.parseMethods(classContent);
            
            // Then, remove method definitions from the content to isolate properties.
            // This regex is simplified and might need refinement for complex method signatures.
            // eslint-disable-next-line no-useless-escape
            classContent = classContent.replace(/(public|private|protected|internal)?\s*(?:static\s+)?(?:async\s+)?(?:virtual\s+)?(?:override\s+)?[\w<>?\[\],]+\s+\w+\s*\(.*?\)\s*\{[\s\S]*?\}/g, '');

            // Parse properties from the remaining content.
            const properties = this.parseProperties(classContent);

            classes.push({
                name: className,
                type: CSharpClassType.Class, // Assuming all found are classes for now.
                accessModifier,
                properties,
                methods,
            });
        }
        return classes;
    }

    /**
     * Parses C# property definitions from a class's content string.
     * It looks for properties with standard getter/setter syntax.
     * @param classContent The string content of a C# class.
     * @returns An array of CSharpProperty objects.
     */
    private parseProperties(classContent: string): CSharpProperty[] {
        const properties: CSharpProperty[] = [];
        // Regex to capture property definitions: access modifier, type, name, and getter/setter block.
        // eslint-disable-next-line no-useless-escape
        const propertyRegex = /(public|private|protected|internal)\s+([\w<>?\[\]]+)\s+(\w+)\s*\{\s*get;\s*(?:set;)?\s*\}/g;
        let propertyMatch: RegExpExecArray | null;

        while ((propertyMatch = propertyRegex.exec(classContent)) !== null) {
            const accessModifier = propertyMatch[1];
            const typeName = propertyMatch[2].replace('?', ''); // Remove '?' for nullable types
            const isNullable = propertyMatch[2].endsWith('?'); // Check if the type is nullable
            const name = propertyMatch[3];

            properties.push({
                name,
                type: { name: typeName, isNullable },
                accessModifier,
            });
        }
        return properties;
    }

    /**
     * Parses C# method definitions from a class's content string.
     * It extracts method name, return type, parameters, and modifiers.
     * @param classContent The string content of a C# class.
     * @returns An array of CSharpMethod objects.
     */
    private parseMethods(classContent: string): CSharpMethod[] {
        const methods: CSharpMethod[] = [];
        // Regex to capture method signatures: access modifier, modifiers, return type, name, generics, and parameters.
        // Using named capture groups for better readability.
        // eslint-disable-next-line no-useless-escape
        const methodRegex = /(?<access>public|private|protected|internal)?\s*(?<modifiers>(?:static|virtual|override|async|\s)*?)\s*(?<returnType>[\w<>\[\],]+)\s+(?<name>\w+)(?<generic><[^>]+>)?\s*\((?<params>[^)]*)\)/g;
        let methodMatch: RegExpExecArray | null;

        while ((methodMatch = methodRegex.exec(classContent)) !== null) {
            // Use the named groups for clarity
            const { access, modifiers, returnType, name,  params: paramsStr } = methodMatch.groups!;
            
            // Parse modifiers into a Set for easy checking.
            const modifierSet = new Set(modifiers.trim().split(/\s+/));

            methods.push({
                name: name,
                // Remove "Task<>" wrappers from async method return types.
                returnType: { name: returnType.replace(/Task<|>/g, '') },
                parameters: this.parseMethodParameters(paramsStr),
                accessModifier: access || "internal", // Default to internal if not specified
                isStatic: modifierSet.has('static'),
                isAsync: modifierSet.has('async'),
                isVirtual: modifierSet.has('virtual'),
                isOverride: modifierSet.has('override'),
            });
        }
        return methods;
    }

    /**
     * Parses the parameters string of a C# method into an array of CSharpParameter objects.
     * Handles parameter names, types, and potential ref/out/in keywords.
     * @param parametersString The string containing method parameters.
     * @returns An array of CSharpParameter objects.
     */
    private parseMethodParameters(parametersString: string): CSharpParameter[] {
        if (!parametersString.trim()) {
            return []; // Return empty array if no parameters.
        }
        // Split parameters by comma, but avoid splitting within generic type arguments (e.g., List<string, int>).
        const paramParts = parametersString.split(/,(?![^<]*>)/g);
        
        return paramParts.map(p => {
            const parts = p.trim().split(/\s+/);
            const name = parts.pop()!; // The last part is the parameter name.
            // Remove 'ref', 'out', 'in' keywords from the type and join the rest as the type name.
            const type = parts.join(' ').replace(/^(ref|out|in)\s+/, ''); 
            return { name, type: { name: type } };
        });
    }
}
