import { DomainTextParser } from "../../data-model-api/domain-specific-model-api";
import { JavaModel, JavaClass, JavaField, JavaAnnotation } from "./java-model";

/**
 * A parser for Java source code that extracts data model information.
 */
export class JavaParser implements DomainTextParser<JavaModel> {

    async parseText(text: string): Promise<JavaModel> {
        try {
            // By parsing in order, we ensure that a syntax error in an early part
            // (like 'package') stops the process immediately.
            const packageName = this.parsePackage(text);
            const imports = this.parseImports(text);
            const classes = this.parseClasses(text);

            return { packageName, imports, classes };
        } catch (e: any) {
            console.error("Java Parsing Error:", e.message);
            throw new Error(`Failed to parse Java source code: ${e.message}`);
        }
    }

    private parsePackage(text: string): string | undefined {
        const packageLine = text.split(/\r?\n/).find(line => line.trim().startsWith('package'));
        if (!packageLine) return undefined;

        const match = packageLine.trim().match(/^package\s+([\w\.]+);$/);
        if (!match) {
            throw new Error(`Invalid package declaration syntax near "${packageLine.trim()}"`);
        }
        return match[1];
    }

    private parseImports(text: string): string[] {
        const imports: string[] = [];
        const lines = text.split(/\r?\n/);

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('import')) {
                // If a line starts with 'import', it MUST be valid.
                const match = trimmedLine.match(/^import\s+([\w\.\*]+);$/);
                if (!match) {
                    throw new Error(`Invalid import statement syntax near "${trimmedLine}"`);
                }
                imports.push(match[1]);
            }
        }
        return imports;
    }

    private parseClasses(text: string): JavaClass[] {
        const lines = text.split(/\r?\n/);

        // First, check for incomplete class/interface/enum declarations that would otherwise be skipped
        for (const line of lines) {
            const trimmedLine = line.trim();
            // Check if the line contains keywords indicating a class/interface/enum declaration
            if (trimmedLine.includes("class") || trimmedLine.includes("interface") || trimmedLine.includes("enum")) {
                // A more lenient regex to catch potential class declaration starts
                const potentialDeclarationMatch = trimmedLine.match(/(public|private|protected)?\s*(class|interface|enum)\s*(\w*)/);
                
                if (potentialDeclarationMatch) {
                    const fullClassRegex = /(public|private|protected)?\s*(class|interface|enum)\s+(\w+)\s*\{/;
                    const fullMatch = trimmedLine.match(fullClassRegex);

                    // If it's a potential declaration but not a full, valid one (e.g., missing name or brace)
                    if (!fullMatch && trimmedLine.length > 0) {
                        // Throw an error to prevent the line from vanishing
                        throw new Error(`Incomplete class, interface, or enum declaration: "${trimmedLine}"`);
                    }
                }
            }
        }

        // If no incomplete declarations caused an error, proceed with parsing complete classes
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
                methods: [],
            };
        });
    }

    private parseFields(classBody: string): JavaField[] {
        const fields: JavaField[] = [];
        const lines = classBody.split(/\r?\n/);
        let collectedAnnotations: JavaAnnotation[] = [];

        for (const line of lines) {
            const trimmedLine = line.trim();

            if (!trimmedLine) continue; // Skip empty lines

            if (!trimmedLine.endsWith(';')) {
                const annotationMatch = trimmedLine.match(/^@(\w+)/);
                if (annotationMatch) {
                    collectedAnnotations.push({ name: annotationMatch[1] });
                } else {
                    // If it's not an annotation and doesn't end with ';', it's an incomplete field declaration
                    throw new Error(`Incomplete Java field declaration: "${trimmedLine}"`);
                }
                continue;
            }

            const declaration = trimmedLine.slice(0, -1).split('=')[0].trim();
            const parts = declaration.split(/\s+/);

            if (parts.length < 2) {
                throw new Error(`Malformed Java field declaration: "${trimmedLine}"`);
            }

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

            collectedAnnotations = [];
        }
        return fields;
    }
}
