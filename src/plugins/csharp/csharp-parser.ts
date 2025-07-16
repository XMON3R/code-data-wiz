import { DomainTextParser } from "../../data-model-api/domain-specific-model-api";
import { CSharpModel, CSharpClass, CSharpProperty, CSharpMethod, CSharpParameter } from "./csharp-model";

/**
 * A more robust parser for C# code that correctly distinguishes between methods and properties.
 */
export class CSharpTextParser implements DomainTextParser<CSharpModel> {
    async parseText(csharpString: string): Promise<CSharpModel> {
        if ((csharpString.match(/{/g) || []).length !== (csharpString.match(/}/g) || []).length) {
            throw new Error("Failed to parse C# source code: Mismatched curly braces.");
        }
        return { classes: this.parseClasses(csharpString) };
    }

    private parseClasses(csharpString: string): CSharpClass[] {
        const classes: CSharpClass[] = [];
        const classRegex = /(public|private|protected|internal)?\s*class\s+(\w+)\s*{((?:[^{}]*|{(?:[^{}]*|{[^{}]*})*})*)}/gs;
        let classMatch: RegExpExecArray | null;

        while ((classMatch = classRegex.exec(csharpString)) !== null) {
            const accessModifier = classMatch[1] || "internal";
            const className = classMatch[2];
            let classContent = classMatch[3];

            const methods = this.parseMethods(classContent);
            
            classContent = classContent.replace(/(public|private|protected|internal)?\s*(static\s+)?(async\s+)?(virtual\s+)?(override\s+)?[\w<>?\[\],]+\s+\w+\s*\(.*?\)\s*\{[\s\S]*?\}/g, '');

            const properties = this.parseProperties(classContent);

            classes.push({
                name: className,
                type: "class",
                accessModifier,
                properties,
                methods,
            });
        }
        return classes;
    }

    private parseProperties(classContent: string): CSharpProperty[] {
        const properties: CSharpProperty[] = [];
        const propertyRegex = /(public|private|protected|internal)\s+([\w<>?\[\]]+)\s+(\w+)\s*\{\s*get;\s*(?:set;)?\s*\}/g;
        let propertyMatch: RegExpExecArray | null;

        while ((propertyMatch = propertyRegex.exec(classContent)) !== null) {
            const accessModifier = propertyMatch[1];
            const typeName = propertyMatch[2].replace('?', '');
            const isNullable = propertyMatch[2].endsWith('?');
            const name = propertyMatch[3];

            properties.push({
                name,
                type: { name: typeName, isNullable },
                accessModifier,
            });
        }
        return properties;
    }

    private parseMethods(classContent: string): CSharpMethod[] {
        const methods: CSharpMethod[] = [];
        const methodRegex = /(?<access>public|private|protected|internal)?\s*(?<modifiers>(?:static|virtual|override|async|\s)*?)\s*(?<returnType>[\w<>\[\],]+)\s+(?<name>\w+)(?<generic><[^>]+>)?\s*\((?<params>[^)]*)\)/g;
        let methodMatch: RegExpExecArray | null;

        while ((methodMatch = methodRegex.exec(classContent)) !== null) {
            // Use the named groups for clarity
            const { access, modifiers, returnType, name,  params: paramsStr } = methodMatch.groups!;
            
            const modifierSet = new Set(modifiers.trim().split(/\s+/));

            methods.push({
                name: name,
                returnType: { name: returnType.replace(/Task<|>/g, '') },
                parameters: this.parseMethodParameters(paramsStr),
                accessModifier: access || "internal",
                isStatic: modifierSet.has('static'),
                isAsync: modifierSet.has('async'),
                isVirtual: modifierSet.has('virtual'),
                isOverride: modifierSet.has('override'),
            });
        }
        return methods;
    }

    private parseMethodParameters(parametersString: string): CSharpParameter[] {
        if (!parametersString.trim()) {
            return [];
        }
        const paramParts = parametersString.split(/,(?![^<]*>)/g);
        
        return paramParts.map(p => {
            const parts = p.trim().split(/\s+/);
            const name = parts.pop()!;
            const type = parts.join(' ').replace(/^(ref|out|in)\s+/, ''); // Remove ref/out/in
            return { name, type: { name: type } };
        });
    }
}
