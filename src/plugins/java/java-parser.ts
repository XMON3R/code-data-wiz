import { DomainTextParser } from "../../data-model-api/domain-specific-model-api";
import { JavaModel, JavaClass, JavaField, JavaAnnotation } from "./java-model";

/**
 * A parser for Java source code that extracts data model information.
 */
export class JavaParser implements DomainTextParser<JavaModel> {

    async parseText(text: string): Promise<JavaModel> {
        try {
            const packageName = this.parsePackage(text);
            const imports = this.parseImports(text);
            const classes = this.parseClasses(text);

            return { packageName, imports, classes };
        } catch (e: any) {
            console.error("Java Parsing Error:", e.message);
            throw new Error("Failed to parse Java source code.");
        }
    }

    private parsePackage(text: string): string | undefined {
        const match = text.match(/package\s+([\w\.]+);/);
        return match?.[1];
    }

    private parseImports(text: string): string[] {
        const importRegex = /import\s+([\w\.\*]+);/g;
        const matches = text.matchAll(importRegex);
        return Array.from(matches, match => match[1]);
    }

    private parseClasses(text: string): JavaClass[] {
        const classRegex = /(public|private|protected)?\s*(class|interface|enum)\s+(\w+)\s*\{([\s\S]*?)\}/g;
        const matches = text.matchAll(classRegex);

        return Array.from(matches, match => {
            const accessModifier = (match[1] || 'default') as "public" | "private" | "protected" | "default";
            const type = match[2] as "class" | "interface" | "enum";
            const name = match[3];
            const body = match[4];

            return {
                name,
                type,
                accessModifier,
                fields: this.parseFields(body),
                methods: [], // Method parsing can be added later
            };
        });
    }

    private parseFields(classBody: string): JavaField[] {
        const fields: JavaField[] = [];
        const lines = classBody.split(/\r?\n/);
        let collectedAnnotations: JavaAnnotation[] = [];

        for (const line of lines) {
            const trimmedLine = line.trim();

            // Skip irrelevant lines but check for annotations first
            if (!trimmedLine.endsWith(';')) {
                const annotationMatch = trimmedLine.match(/^@(\w+)/);
                if (annotationMatch) {
                    collectedAnnotations.push({ name: annotationMatch[1] });
                }
                continue;
            }

            // At this point, we have a line ending in a semicolon, likely a field.
            // Remove the semicolon and any initializer part (e.g., '= "standard"')
            const declaration = trimmedLine.slice(0, -1).split('=')[0].trim();
            const parts = declaration.split(/\s+/);

            if (parts.length < 2) continue; // Not a valid field (e.g., just "private;")

            // The last two parts are always the type and the name
            const name = parts[parts.length - 1];
            const type = parts[parts.length - 2];
            const modifiers = parts.slice(0, -2);

            const accessModifier = 
                modifiers.find(m => m === 'public' || m === 'private' || m === 'protected') as 'public' | 'private' | 'protected' | 'default'
                || 'default';
            
            const isStatic = modifiers.includes('static');
            const isFinal = modifiers.includes('final');

            fields.push({
                name,
                type,
                accessModifier,
                isStatic,
                isFinal,
                annotations: collectedAnnotations,
            });

            collectedAnnotations = []; // Reset for the next field
        }
        return fields;
    }
}