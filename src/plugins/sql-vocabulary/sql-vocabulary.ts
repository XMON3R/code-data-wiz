import { Type, UniversalType, UniversalFormat } from "../../data-model-api/universal-model";

interface SQLTypeMapping {
    universalType: UniversalType;
    format?: UniversalFormat | string; // Keep string for now as some formats are not in enum
}

/**
 * A vocabulary of common SQL types mapped to universal types.
 * This allows translation between SQL-specific column types and abstract universal types.
 */
export const SQLVocabulary: Record<string, SQLTypeMapping> = {
    // Integer types
    "int": { universalType: UniversalType.Number },
    "integer": { universalType: UniversalType.Number },
    "tinyint": { universalType: UniversalType.Number },
    "smallint": { universalType: UniversalType.Number },
    "mediumint": { universalType: UniversalType.Number },
    "bigint": { universalType: UniversalType.Number, format: UniversalFormat.Long },
    "unsigned big int": { universalType: UniversalType.Number, format: UniversalFormat.Long },
    "int2": { universalType: UniversalType.Number },
    "int8": { universalType: UniversalType.Number },

    // Character types
    "varchar": { universalType: UniversalType.String },
    "character": { universalType: UniversalType.String },
    "varying character": { universalType: UniversalType.String },
    "nchar": { universalType: UniversalType.String },
    "native character": { universalType: UniversalType.String },
    "nvarchar": { universalType: UniversalType.String },
    "text": { universalType: UniversalType.String },
    "clob": { universalType: UniversalType.String },

    // Blob types
    "blob": { universalType: UniversalType.String, format: UniversalFormat.Byte },

    // Real and double precision types
    "real": { universalType: UniversalType.Number, format: UniversalFormat.Double },
    "double": { universalType: UniversalType.Number, format: UniversalFormat.Double },
    "double precision": { universalType: UniversalType.Number, format: UniversalFormat.Double },
    "float": { universalType: UniversalType.Number, format: UniversalFormat.Double },

    // Numeric types
    "numeric": { universalType: UniversalType.Number },
    "decimal": { universalType: UniversalType.Number, format: UniversalFormat.Decimal },

    // Boolean types
    "boolean": { universalType: UniversalType.Boolean },

    // Date and time types
    "date": { universalType: UniversalType.Date },
    "datetime": { universalType: UniversalType.Datetime },
    "timestamp": { universalType: UniversalType.Datetime },
    "time": { universalType: UniversalType.String, format: UniversalFormat.Time },
    "year": { universalType: UniversalType.Number },
};

/**
 * Translates a SQL type string (e.g., "VARCHAR(255)") into a universal Type object.
 * This enables mapping raw SQL column definitions to a common format for interoperability.
 * 
 * @param sqlType - The SQL type to translate (e.g., "VARCHAR(255)").
 * @returns A Type object representing the corresponding universal type.
 */
export function toUniversalType(sqlType: string): Type {
    const baseType = sqlType.split("(")[0].trim().toLowerCase(); // Strip parameters
    const mapping = SQLVocabulary[baseType];
    if (mapping) {
        return {
            domainSpecificType: sqlType,
            universalType: mapping.universalType,
            ...(mapping.format && { format: mapping.format as UniversalFormat }),
        };
    }
    // If not found in known types, default to 'Other' with original type string preserved
    return { domainSpecificType: sqlType, universalType: UniversalType.Other };
}

/**
 * Converts a universal Type object into its closest SQL type string.
 * If a domain-specific type is provided and valid, it's used directly.
 * Otherwise, attempts to match based on universal type and optional format.
 * 
 * @param universalType - The universal Type object to convert.
 * @returns The SQL type string (e.g., "VARCHAR", "BIGINT", etc.)
 */
export function fromUniversalType(universalType: Type): string {
    // Use original domain-specific type if it matches a known SQL type
    if (universalType.domainSpecificType) {
        const baseType = universalType.domainSpecificType.split("(")[0].trim().toLowerCase();
        if (SQLVocabulary[baseType]) {
            return universalType.domainSpecificType;
        }
    }

    // Fallback: match based on universalType and optional format
    if (universalType.universalType) {
        for (const sqlType in SQLVocabulary) {
            const mapping = SQLVocabulary[sqlType];
            const formatMatch = !mapping.format || mapping.format === universalType.format;
            if (mapping.universalType === universalType.universalType && formatMatch) {
                return sqlType;
            }
        }
    }

    // Default fallback
    return universalType.domainSpecificType || "VARCHAR";
}
