import { Type } from "../../data-model-api/universal-model";

interface JsonSchemaTypeMapping {
    universalType: "string" | "number" | "boolean" | "other";
    format?: string;
}

/**
 * A vocabulary of common JSON Schema types.
 */
export const JsonSchemaVocabulary: Record<string, JsonSchemaTypeMapping> = {
    "string": { universalType: "string" },
    "number": { universalType: "number" },
    "integer": { universalType: "number" },
    "boolean": { universalType: "boolean" },
    "object": { universalType: "other" },
    "array": { universalType: "other" },
    "null": { universalType: "other" },
};

/**
 * Translates a JSON Schema type to a universal type.
 * @param jsonType The JSON Schema type to translate.
 * @returns The universal type representation.
 */
export function toUniversalType(jsonType: string): Type {
    const mapping = JsonSchemaVocabulary[jsonType.toLowerCase()];
    if (mapping) {
        return {
            domainSpecificType: jsonType,
            universalType: mapping.universalType,
            ...(mapping.format && { format: mapping.format }),
        };
    }
    return { domainSpecificType: jsonType, universalType: "other" };
}

/**
 * Translates a universal type to a JSON Schema type.
 * @param universalType The universal type to translate.
 * @returns The JSON Schema type representation.
 */
export function fromUniversalType(universalType: Type): string {
    // Attempt to use the domainSpecificType directly if it's a known JSON Schema type
    if (universalType.domainSpecificType && JsonSchemaVocabulary[universalType.domainSpecificType.toLowerCase()]) {
        return universalType.domainSpecificType;
    }

    // Fallback to universal type mapping
    if (universalType.universalType) {
        for (const jsonType in JsonSchemaVocabulary) {
            const mapping = JsonSchemaVocabulary[jsonType];
            if (mapping.universalType === universalType.universalType && (!mapping.format || mapping.format === universalType.format)) {
                return jsonType;
            }
        }
    }
    return universalType.domainSpecificType || "string";
}
