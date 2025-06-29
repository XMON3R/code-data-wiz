import { DomainTextParser } from "../../data-model-api/domain-specific-model-api";
import { CSharpModel, CSharpClass, CSharpProperty, CSharpType } from "./csharp-model";

/**
 * A parser for C# code strings into a CSharpModel.
 * This implementation uses regular expressions to extract class and property information.
 */
export class CSharpTextParser implements DomainTextParser<CSharpModel> {
    async parseText(csharpString: string): Promise<CSharpModel> {
        const classes: CSharpClass[] = [];

        // Regex to find class definitions: `[accessModifier] class [ClassName] { ... }`
        const classRegex = /(public|private|protected|internal)?\s*class\s+(\w+)\s*{([^}]*)}/g;
        let classMatch: RegExpExecArray | null;

        while ((classMatch = classRegex.exec(csharpString)) !== null) {
            const accessModifier = classMatch[1] || "internal"; // Default to internal if not specified
            const className = classMatch[2];
            const classContent = classMatch[3];

            const properties: CSharpProperty[] = [];

            classes.push({
                name: className,
                type: "class",
                accessModifier: accessModifier,
                properties: [],
                methods: [], // Basic parser does not extract methodsq
            });
        }

        return { classes: classes };
    }
}
