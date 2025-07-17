import { DomainTextParser } from "../../data-model-api/domain-specific-model-api";
import { JavaModel, JavaClass, JavaField, JavaAnnotation, JavaClassType } from "./java-model";

/**
 * Parses Java source code strings into a structured JavaModel.
 * This parser extracts class, field, and annotation information.
 */
export class JavaParser implements DomainTextParser<JavaModel> {

    /**
     * Parses a Java code string into a JavaModel.
     * @param text The Java code as a string.
     * @returns A Promise resolving to the JavaModel.
     * @throws Error if parsing fails due to syntax issues.
     */
    async parseText(text: string): Promise<JavaModel> {
        try {
            // Currently, package and import parsing are commented out.
            /*
            const packageName = this.parsePackage(text);
            const imports = this.parseImports(text);*/
            const classes = this.parseClasses(text);

            return { classes };
        } catch (e) {
            const error = e as Error;
            console.error("Java Parsing Error:", error.message);
            throw new Error(`Failed to parse Java source code: ${error.message}`);
        }
    }

    // Commented out: Package and import parsing logic to be resolved in the future with correct handling.
    /*
    private parsePackage(text: string): string | undefined {
        const packageLine = text.split(/\r?\n/).find(line => line.trim().startsWith('package'));
        if (!packageLine) return undefined;

        // FIX (Line 28): Removed unnecessary backslash from \.
        const match = packageLine.trim().match(/^package\s+([\w.]+);$/);
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
                const match = trimmedLine.match(/^import\s+([\w.*]+);$/);
                if (!match) {
                    throw new Error(`Invalid import statement syntax near "${trimmedLine}"`);
                }
                imports.push(match[1]);
            }
        }
        return imports;
    }*/

    /**
     * Parses Java class, interface, and enum declarations from the provided text.
     * Includes basic validation for declaration completeness.
     * @param text The Java code as a string.
     * @returns An array of JavaClass objects.
     * @throws Error if an incomplete declaration is found.
     */
    private parseClasses(text: string): JavaClass[] {
        const lines = text.split(/\r?\n/);

        // First, check for incomplete class/interface/enum declarations that would otherwise be skipped.
        for (const line of lines) {
            const trimmedLine = line.trim();
            // Check if the line contains keywords indicating a class/interface/enum declaration.
            if (trimmedLine.includes("class") || trimmedLine.includes("interface") || trimmedLine.includes("enum")) {
                // A more lenient regex to catch potential class declaration starts.
                const potentialDeclarationMatch = trimmedLine.match(/(public|private|protected)?\s*(class|interface|enum)\s*(\w*)/);
                
                if (potentialDeclarationMatch) {
                    // Regex to match a complete declaration with name and opening brace.
                    const fullClassRegex = /(public|private|protected)?\s*(class|interface|enum)\s+(\w+)\s*\{/;
                    const fullMatch = trimmedLine.match(fullClassRegex);

                    // If it's a potential declaration but not a full, valid one (e.g., missing name or brace).
                    if (!fullMatch && trimmedLine.length > 0) {
                        // Throw an error to prevent the line from vanishing and indicate the issue.
                        throw new Error(`Incomplete class, interface, or enum declaration: "${trimmedLine}"`);
                    }
                }
            }
        }

        // If no incomplete declarations caused an error, proceed with parsing complete classes.
        const classRegex = /(public|private|protected)?\s*(class|interface|enum)\s+(\w+)\s*\{([\s\S]*?)\}/g;
        const matches = text.matchAll(classRegex);

        return Array.from(matches, match => {
            const accessModifier = (match[1] || 'default') as JavaAccessModifier;
            const type = match[2] as JavaClassType; // Cast to JavaClassType.
            const name = match[3];
            const body = match[4];

            return {
                name,
                type,
                accessModifier,
                fields: this.parseFields(body),
                methods: [], // Methods are not parsed in this version.
            };
        });
    }

    /**
     * Parses Java field declarations from a class body string.
     * It extracts field names, types, modifiers, and annotations.
     * @param classBody The string content of a Java class body.
     * @returns An array of JavaField objects.
     * @throws Error if a malformed or incomplete field declaration is found.
     */
    private parseFields(classBody: string): JavaField[] {
        const fields: JavaField[] = [];
        const lines = classBody.split(/\r?\n/);
        let collectedAnnotations: JavaAnnotation[] = [];

        for (const line of lines) {
            const trimmedLine = line.trim();

            if (!trimmedLine) continue; // Skip empty lines.

            // Check for annotations first.
            if (!trimmedLine.endsWith(';')) {
                const annotationMatch = trimmedLine.match(/^@(\w+)/);
                if (annotationMatch) {
                    collectedAnnotations.push({ name: annotationMatch[1] });
                } else {
                    // If it's not an annotation and doesn't end with ';', it's likely an incomplete field declaration.
                    throw new Error(`Incomplete Java field declaration: "${trimmedLine}"`);
                }
                continue; // Move to the next line after processing annotation.
            }

            // Process field declaration ending with ';'.
            const declaration = trimmedLine.slice(0, -1).split('=')[0].trim(); // Remove trailing ';' and split by '=' to ignore initializers.
            const parts = declaration.split(/\s+/);

            if (parts.length < 2) {
                throw new Error(`Malformed Java field declaration: "${trimmedLine}"`);
            }

            const name = parts[parts.length - 1]; // Last part is the field name.
            const type = parts[parts.length - 2]; // Second to last part is the field type.
            const modifiers = parts.slice(0, -2); // Remaining parts are modifiers.

            // Determine access modifier, defaulting to 'default' (package-private).
            const accessModifier = 
                modifiers.find(m => m === 'public' || m === 'private' || m === 'protected') as JavaAccessModifier
                || 'default';
            
            const isStatic = modifiers.includes('static');
            const isFinal = modifiers.includes('final');

            fields.push({
                name,
                type,
                accessModifier,
                isStatic,
                isFinal,
                annotations: collectedAnnotations, // Assign collected annotations.
            });

            collectedAnnotations = []; // Reset annotations for the next field.
        }
        return fields;
    }
}

/**
 * Enum representing Java access modifiers.
 */
export enum JavaAccessModifier {
    Public = "public",
    Private = "private",
    Protected = "protected",
    Default = "default", // Represents package-private access.
}
