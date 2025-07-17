import { Type, UniversalType, UniversalFormat } from "../../data-model-api/universal-model";

interface SQLTypeMapping {
    universalType: UniversalType;
    format?: UniversalFormat | string; // Keep string for now as some formats are not in enum
}

/**
 * A vocabulary of common SQL types.
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
    "real": { universalType: UniversalType.Number, format: UniversalFormat.Double }, // Assuming float maps to double for now
    "double": { universalType: UniversalType.Number, format: UniversalFormat.Double },
    "double precision": { universalType: UniversalType.Number, format: UniversalFormat.Double },
    "float": { universalType: UniversalType.Number, format: UniversalFormat.Double }, // Assuming float maps to double for now

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
            ...(mapping.format && { format: mapping.format as UniversalFormat }), // Cast format to UniversalFormat
        };
    }
    return { domainSpecificType: sqlType, universalType: UniversalType.Other };
}

/**
 * Translates a universal type to a SQL type.
 * @param universalType The universal type to translate.
 * @returns The SQL type representation.
 */
export function fromUniversalType(universalType: Type): string {
    // Attempt to use the domainSpecificType directly if it's a known SQL type
    if (universalType.domainSpecificType) {
        const baseType = universalType.domainSpecificType.split("(")[0].trim().toLowerCase();
        if (SQLVocabulary[baseType]) {
            return universalType.domainSpecificType;
        }
    }

    // Fallback to universal type mapping
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
