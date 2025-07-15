import { Type } from "../../data-model-api/universal-model";

interface SQLTypeMapping {
    universalType: "string" | "number" | "boolean" | "date" | "datetime";
    format?: string;
}

/**
 * A vocabulary of common SQL types.
 */
export const SQLVocabulary: Record<string, SQLTypeMapping> = {
    "varchar": { universalType: "string" },
    "int": { universalType: "number" },
    "integer": { universalType: "number" },
    "boolean": { universalType: "boolean" },
    "date": { universalType: "date" },
    "timestamp": { universalType: "datetime" },
};

/**
 * Translates a SQL type to a universal type.
 * @param sqlType The SQL type to translate.
 * @returns The universal type representation.
 */
export function toUniversalType(sqlType: string): Type {
    const mapping = SQLVocabulary[sqlType.toLowerCase()];
    if (mapping) {
        return {
            domainSpecificType: sqlType,
            universalType: mapping.universalType,
            ...(mapping.format && { format: mapping.format }),
        };
    }
    return { domainSpecificType: sqlType, universalType: "other" };
}

/**
 * Translates a universal type to a SQL type.
 * @param universalType The universal type to translate.
 * @returns The SQL type representation.
 */
export function fromUniversalType(universalType: Type): string {
    if (universalType.universalType) {
        for (const sqlType in SQLVocabulary) {
            const mapping = SQLVocabulary[sqlType];
            if (mapping.universalType === universalType.universalType && (!mapping.format || mapping.format === universalType.format)) {
                return sqlType;
            }
        }
    }
    return universalType.domainSpecificType || "VARCHAR";
}
