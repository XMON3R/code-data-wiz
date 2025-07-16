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
    // For any unknown type (like 'List' or a custom class name), preserve it.
    return { domainSpecificType: csharpType, universalType: "other" };
}

/**
 * Translates a universal type to a C# type.
 */
export function fromUniversalType(universalType: Type): string {
    // --- THIS IS THE CORRECTED LOGIC ---

    // If the type is 'other', it means it's a custom class or a type not in our
    // vocabulary (like 'List'). In this case, we MUST use the original name.
    if (universalType.universalType === "other") {
        return universalType.domainSpecificType || "object";
    }
    
    // Otherwise, find the best match from our vocabulary.
    if (universalType.universalType) {
        for (const csharpType in CSharpVocabulary) {
            const mapping = CSharpVocabulary[csharpType];
            if (mapping.universalType === universalType.universalType && (!mapping.format || mapping.format === universalType.format)) {
                return csharpType; // Return the canonical C# type (e.g., "int")
            }
        }
    }

    // As a last resort, fall back to the original type name or "object".
    return universalType.domainSpecificType || "object";
}