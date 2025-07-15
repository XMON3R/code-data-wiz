import { Type } from "../../data-model-api/universal-model";

interface CSharpTypeMapping {
    universalType: "string" | "number" | "boolean" | "datetime" | "other";
    format?: string;
}

/**
 * A vocabulary of common C# types.
 */
export const CSharpVocabulary: Record<string, CSharpTypeMapping> = {
    // String types
    "string": { universalType: "string" },
    "char": { universalType: "string" },

    // Integer types
    "int": { universalType: "number" },
    "uint": { universalType: "number" },
    "long": { universalType: "number", format: "long" },
    "ulong": { universalType: "number", format: "long" },
    "short": { universalType: "number" },
    "ushort": { universalType: "number" },
    "byte": { universalType: "number" },
    "sbyte": { universalType: "number" },

    // Floating-point types
    "float": { universalType: "number", format: "float" },
    "double": { universalType: "number", format: "double" },
    "decimal": { universalType: "number", format: "decimal" },

    // Boolean type
    "bool": { universalType: "boolean" },

    // Date and time types
    "datetime": { universalType: "datetime" },
    "datetimeoffset": { universalType: "datetime" },
    "timespan": { universalType: "string" },

    // Other types
    "guid": { universalType: "string", format: "uuid" },
    "byte[]": { universalType: "string", format: "byte" },
    "object": { universalType: "other" },
};

/**
 * Translates a C# type to a universal type.
 * @param csharpType The C# type to translate.
 * @returns The universal type representation.
 */
export function toUniversalType(csharpType: string): Type {
    const baseType = csharpType.split("<")[0].trim().toLowerCase();
    const mapping = CSharpVocabulary[baseType];
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
    // First, try to find a mapping based on universalType and format
    if (universalType.universalType) {
        for (const csharpType in CSharpVocabulary) {
            const mapping = CSharpVocabulary[csharpType];
            if (mapping.universalType === universalType.universalType && (!mapping.format || mapping.format === universalType.format)) {
                return csharpType; // Return the canonical C# type (e.g., "int")
            }
        }
    }

    // If no universal mapping is found, fall back to domainSpecificType if it's a known C# type
    if (universalType.domainSpecificType) {
        const lowerCaseDomainType = universalType.domainSpecificType.toLowerCase();
        if (CSharpVocabulary[lowerCaseDomainType]) {
            return lowerCaseDomainType; // Return the lowercase C# type (e.g., "int")
        }
    }

    // As a last resort, return "object" or the original domainSpecificType if it's truly unmappable
    return universalType.domainSpecificType || "object";
}
