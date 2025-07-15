import { Type } from "../../data-model-api/universal-model";

interface CSharpTypeMapping {
    universalType: "string" | "number" | "boolean" | "datetime";
    format?: string;
}

/**
 * A vocabulary of common C# types.
 */
export const CSharpVocabulary: Record<string, CSharpTypeMapping> = {
    "string": { universalType: "string" },
    "int": { universalType: "number" },
    "bool": { universalType: "boolean" },
    "float": { universalType: "number" },
    "double": { universalType: "number" },
    "decimal": { universalType: "number" },
    "datetime": { universalType: "datetime" },
};

/**
 * Translates a C# type to a universal type.
 * @param csharpType The C# type to translate.
 * @returns The universal type representation.
 */
export function toUniversalType(csharpType: string): Type {
    const mapping = CSharpVocabulary[csharpType.toLowerCase()];
    if (mapping) {
        return {
            domainSpecificType: csharpType,
            universalType: mapping.universalType,
            ...(mapping.format && { format: mapping.format }),
        };
    }
    return { domainSpecificType: csharpType, universalType: "other" };
}

/**
 * Translates a universal type to a C# type.
 * @param universalType The universal type to translate.
 * @returns The C# type representation.
 */
export function fromUniversalType(universalType: Type): string {
    if (universalType.universalType) {
        for (const csharpType in CSharpVocabulary) {
            const mapping = CSharpVocabulary[csharpType];
            if (mapping.universalType === universalType.universalType && (!mapping.format || mapping.format === universalType.format)) {
                return csharpType;
            }
        }
    }
    return universalType.domainSpecificType || "object";
}
