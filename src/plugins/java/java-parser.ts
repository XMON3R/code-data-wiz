import { DomainTextParser } from "../../data-model-api/domain-specific-model-api";
import { JavaModel, JavaClass, JavaField, JavaAnnotation, JavaMethod } from "./java-model";

/**
 * A more robust parser for Java source code that correctly distinguishes
 * between methods and fields.
 */
export class JavaParser implements DomainTextParser<JavaModel> {

    async parseText(text: string): Promise<JavaModel> {
        try {
            const packageName = this.parsePackage(text);
            const imports = this.parseImports(text);
            const classes = this.parseClasses(text);

            return { packageName, imports, classes };
        } catch (e) {
            const error = e as Error;
            console.error("Java Parsing Error:", error.message);
            throw new Error(`Failed to parse Java source code: ${error.message}`);
        }
    }

    private parsePackage(text: string): string | undefined {
        const match = text.match(/package\s+([\w.]+);/);
        return match?.[1];
    }

    private parseImports(text: string): string[] {
        const importRegex = /import\s+([\w.*]+);/g;
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
            let body = match[4];

            // --- THE FIX IS HERE ---
            // 1. Parse methods from the original class body.
            const methods = this.parseMethods(body);
            
            // 2. Remove the method bodies from the content string. This is crucial
            //    to prevent the field parser from misinterpreting method parameters.
            body = body.replace(/(?:@\w+\s*)*(public|private|protected)?\s*(static\s+)?\w+\s+\w+\s*\([^)]*\)\s*\{[\s\S]*?\}/g, '');

            // 3. Parse fields from the remaining (cleaned) content.
            const fields = this.parseFields(body);

            return {
                name,
                type,
                accessModifier,
                fields,
                methods,
            };
        });
    }

    private parseMethods(classBody: string): JavaMethod[] {
        const methods: JavaMethod[] = [];
        const methodRegex = /(?:(@\w+)\s*)*(public|private|protected)?\s*(static)?\s*(\w+)\s+(\w+)\s*\(([^)]*)\)\s*\{/g;
        let match;
        
        while ((match = methodRegex.exec(classBody)) !== null) {
            const annotations = (match[1] || '').split(/\s*@/).filter(Boolean).map(name => ({ name }));
            const accessModifier = (match[2] || 'default') as "public" | "private" | "protected" | "default";
            const returnType = match[4];
            const name = match[5];
            const paramsString = match[6];
            
            const parameters = paramsString.split(',')
                .map(p => p.trim().split(/\s+/))
                .filter(p => p.length === 2)
                .map(([type, name]) => ({ type, name }));

            methods.push({
                name,
                returnType,
                accessModifier,
                parameters,
                annotations,
            });
        }
        return methods;
    }

    private parseFields(classBody: string): JavaField[] {
        const fields: JavaField[] = [];
        const lines = classBody.split(/\r?\n/);
        let collectedAnnotations: JavaAnnotation[] = [];

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;

            const annotationMatch = trimmedLine.match(/^@(\w+)/);
            if (annotationMatch) {
                collectedAnnotations.push({ name: annotationMatch[1] });
                continue;
            }

            if (!trimmedLine.endsWith(';')) continue;

            const declaration = trimmedLine.slice(0, -1).split('=')[0].trim();
            const parts = declaration.split(/\s+/);
            if (parts.length < 2) continue;

            const name = parts[parts.length - 1];
            const type = parts[parts.length - 2];
            const modifiers = parts.slice(0, -2);

            fields.push({
                name,
                type,
                accessModifier: (modifiers.find(m => ["public", "private", "protected"].includes(m)) || 'default') as any,
                isStatic: modifiers.includes('static'),
                isFinal: modifiers.includes('final'),
                annotations: collectedAnnotations,
            });

            collectedAnnotations = [];
        }
        return fields;
    }
}
