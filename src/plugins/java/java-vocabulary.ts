import { Type } from "../../data-model-api/universal-model";

interface JavaTypeMapping {
    universalType: "string" | "number" | "boolean" | "date" | "datetime" | "other";
    format?: string;
}

/**
 * A vocabulary of common Java types.
 */
export const JavaVocabulary: Record<string, JavaTypeMapping> = {
    // String types
    "String": { universalType: "string" },
    "char": { universalType: "string" },

    // Integer types
    "int": { universalType: "number" },
    "Integer": { universalType: "number" },
    "long": { universalType: "number" },
    "Long": { universalType: "number" },
    "short": { universalType: "number" },
    "Short": { universalType: "number" },
    "byte": { universalType: "number" },
    "Byte": { universalType: "number" },

    // Floating-point types
    "float": { universalType: "number" },
    "Float": { universalType: "number" },
    "double": { universalType: "number" },
    "Double": { universalType: "number" },
    "BigDecimal": { universalType: "number", format: "decimal" },

    // Boolean type
    "boolean": { universalType: "boolean" },
    "Boolean": { universalType: "boolean" },

    // Date and time types
    "Date": { universalType: "datetime" },
    "LocalDate": { universalType: "date" },
    "LocalDateTime": { universalType: "datetime" },
    "ZonedDateTime": { universalType: "datetime" },

    // Other types
    "UUID": { universalType: "string", format: "uuid" },
    "byte[]": { universalType: "string", format: "byte" },
    "Object": { universalType: "other" },
};

/**
 * Translates a Java type to a universal type.
 * @param javaType The Java type to translate.
 * @returns The universal type representation.
 */
export function toUniversalType(javaType: string): Type {
    const baseType = javaType.split("<")[0].trim();
    const mapping = JavaVocabulary[baseType];
    if (mapping) {
        return {
            domainSpecificType: javaType,
            universalType: mapping.universalType,
            ...(mapping.format && { format: mapping.format }),
        };
    }
    return { domainSpecificType: javaType, universalType: "other" };
}

/**
 * Translates a universal type to a Java type.
 * @param universalType The universal type to translate.
 * @returns The Java type representation.
 */
export function fromUniversalType(universalType: Type): string {
    if (universalType.universalType) {
        for (const javaType in JavaVocabulary) {
            const mapping = JavaVocabulary[javaType];
            if (mapping.universalType === universalType.universalType && (!mapping.format || mapping.format === universalType.format)) {
                return javaType;
            }
        }
    }
    return universalType.domainSpecificType || "Object";
}
