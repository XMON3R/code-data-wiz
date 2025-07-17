import { Type, UniversalType, UniversalFormat } from "../../data-model-api/universal-model";

interface CSharpTypeMapping {
    universalType: UniversalType;
    format?: UniversalFormat | string; // Keep string for now as some formats are not in enum
}

/**
 * A vocabulary of common C# types.
 */
export const CSharpVocabulary: Record<string, CSharpTypeMapping> = {
    // String types
    "string": { universalType: UniversalType.String },
    "char": { universalType: UniversalType.String },

    // Integer types
    "int": { universalType: UniversalType.Number },
    "uint": { universalType: UniversalType.Number },
    "long": { universalType: UniversalType.Number, format: UniversalFormat.Long },
    "ulong": { universalType: UniversalType.Number, format: UniversalFormat.Long },
    "short": { universalType: UniversalType.Number },
    "ushort": { universalType: UniversalType.Number },
    "byte": { universalType: UniversalType.Number, format: UniversalFormat.Byte },
    "sbyte": { universalType: UniversalType.Number },

    // Floating-point types
    "float": { universalType: UniversalType.Number, format: UniversalFormat.Double }, // Assuming float maps to double for now
    "double": { universalType: UniversalType.Number, format: UniversalFormat.Double },
    "decimal": { universalType: UniversalType.Number, format: UniversalFormat.Decimal },

    // Boolean type
    "bool": { universalType: UniversalType.Boolean },

    // Date and time types
    "datetime": { universalType: UniversalType.Datetime },
    "datetimeoffset": { universalType: UniversalType.Datetime },
    "timespan": { universalType: UniversalType.String },

    // Other types
    "guid": { universalType: UniversalType.String, format: UniversalFormat.Uuid },
    "byte[]": { universalType: UniversalType.String, format: UniversalFormat.Byte },
    "object": { universalType: UniversalType.Other },
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
            ...(mapping.format && { format: mapping.format as UniversalFormat }), // Cast format to UniversalFormat
        };
    }
    // For any unknown type (like 'List' or a custom class name), preserve it.
    return { domainSpecificType: csharpType, universalType: UniversalType.Other };
}

/**
 * Translates a universal type to a C# type.
 */
export function fromUniversalType(universalType: Type): string {
    // --- THIS IS THE CORRECTED LOGIC ---

    // If the type is 'other', it means it's a custom class or a type not in our
    // vocabulary (like 'List'). In this case, we MUST use the original name.
    if (universalType.universalType === UniversalType.Other) {
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
