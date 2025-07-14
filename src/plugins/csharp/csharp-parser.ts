import { DomainTextParser } from "../../data-model-api/domain-specific-model-api";
import { CSharpModel, CSharpClass, CSharpProperty } from "./csharp-model";

/**
 * A parser for C# code strings into a CSharpModel.
 * This implementation uses regular expressions to extract class and property information.
 */
export class CSharpTextParser implements DomainTextParser<CSharpModel> {
    async parseText(csharpString: string): Promise<CSharpModel> {
        // First, perform a basic validation for balanced curly braces.
        if ((csharpString.match(/{/g) || []).length !== (csharpString.match(/}/g) || []).length) {
            throw new Error("Failed to parse C# source code: Mismatched curly braces.");
        }

        try {
            const classes: CSharpClass[] = this.parseClasses(csharpString);
            return { classes: classes };
        } catch (e: any) {
            console.error("C# Parsing Error:", e.message);
            throw new Error(`Failed to parse C# source code: ${e.message}`);
        }
    }

    private parseClasses(csharpString: string): CSharpClass[] {
        try {
            const classes: CSharpClass[] = [];

            // Regex to find class definitions: `[accessModifier] class [ClassName] { ... }`
            // The `s` flag allows `.` to match newline characters.
            const classRegex = /(public|private|protected|internal)?\s*class\s+(\w+)\s*{((?:[^{}]*|{(?:[^{}]*|{[^{}]*})*})*)}/g;
            let classMatch: RegExpExecArray | null;

            while ((classMatch = classRegex.exec(csharpString)) !== null) {
                const accessModifier = classMatch[1] || "internal"; // Default to internal if not specified
                const className = classMatch[2];
                const classContent = classMatch[3];

                const properties: CSharpProperty[] = this.parseProperties(classContent);

                classes.push({
                    name: className,
                    type: "class",
                    accessModifier: accessModifier,
                    properties: properties,
                    methods: [], // Basic parser does not extract methods
                });
            }

            return classes;
        } catch (e: any) {
            console.error("C# Parse Classes Error:", e.message);
            throw new Error(`Failed to parse C# classes: ${e.message}`);
        }
    }

    private parseProperties(classContent: string): CSharpProperty[] {
        try {
            const properties: CSharpProperty[] = [];
            // Regex to find property definitions: `[accessModifier] [type] [PropertyName] { get; set; }` or `[accessModifier] [type] [PropertyName];`
            const propertyRegex = /(public|private|protected|internal)?\s*([\w<>?]+)\s+(\w+)\s*(?:\{[^}]+\}|;)/g;
            let propertyMatch: RegExpExecArray | null;

            while ((propertyMatch = propertyRegex.exec(classContent)) !== null) {
                const propertyAccessModifier = propertyMatch[1] || "internal";
                let propertyType = propertyMatch[2];
                const propertyName = propertyMatch[3];

                // Handle nullable types (e.g., "decimal?") to match the expected output
                if (propertyType.endsWith("?")) {
                    propertyType = propertyType.slice(0, -1);
                }

                properties.push({
                    name: propertyName,
                    type: { name: propertyType },
                    accessModifier: propertyAccessModifier,
                });
            }

            return properties;
        } catch (e: any) {
            console.error("C# Parse Properties Error:", e.message);
            throw new Error(`Failed to parse C# properties: ${e.message}`);
        }
    }
}
