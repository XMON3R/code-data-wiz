import { Type } from "../../data-model-api/universal-model";

interface SQLTypeMapping {
    universalType: "string" | "number" | "boolean" | "date" | "datetime";
    format?: string;
}

/**
 * A vocabulary of common SQL types.
 */
export const SQLVocabulary: Record<string, SQLTypeMapping> = {
    // Integer types
    "int": { universalType: "number" },
    "integer": { universalType: "number" },
    "tinyint": { universalType: "number" },
    "smallint": { universalType: "number" },
    "mediumint": { universalType: "number" },
    "bigint": { universalType: "number" },
    "unsigned big int": { universalType: "number" },
    "int2": { universalType: "number" },
    "int8": { universalType: "number" },

    // Character types
    "varchar": { universalType: "string" },
    "character": { universalType: "string" },
    "varying character": { universalType: "string" },
    "nchar": { universalType: "string" },
    "native character": { universalType: "string" },
    "nvarchar": { universalType: "string" },
    "text": { universalType: "string" },
    "clob": { universalType: "string" },

    // Blob types
    "blob": { universalType: "string", format: "byte" },

    // Real and double precision types
    "real": { universalType: "number" },
    "double": { universalType: "number" },
    "double precision": { universalType: "number" },
    "float": { universalType: "number" },

    // Numeric types
    "numeric": { universalType: "number" },
    "decimal": { universalType: "number" },

    // Boolean types
    "boolean": { universalType: "boolean" },

    // Date and time types
    "date": { universalType: "date" },
    "datetime": { universalType: "datetime" },
    "timestamp": { universalType: "datetime" },
    "time": { universalType: "string", format: "time" },
    "year": { universalType: "number" },
};

/**
 * Translates a SQL type to a universal type.
 * @param sqlType The SQL type to translate.
 * @returns The universal type representation.
 */
export function toUniversalType(sqlType: string): Type {
    const baseType = sqlType.split("(")[0].trim().toLowerCase();
    const mapping = SQLVocabulary[baseType];
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
