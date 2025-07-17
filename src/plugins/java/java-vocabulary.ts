import { Type, UniversalFormat } from "../../data-model-api/universal-model";

enum UniversalType {
    String = "string",
    Number = "number",
    Boolean = "boolean",
    Date = "date",
    Datetime = "datetime",
    Other = "other",
}

interface JavaTypeMapping {
    universalType: UniversalType;
    format?: UniversalFormat;
}

/**
 * Translates a Java type to a universal type.
 * @param javaType The Java type to translate.
 * @returns The universal type representation.
 */
export function toUniversalType(javaType: string): Type {
    const mapping: JavaTypeMapping = {
        universalType: UniversalType.String,
    };
    switch (javaType.toLowerCase()) { // Convert to lowercase for case-insensitive comparison
        case "string":
            mapping.universalType = UniversalType.String;
            break;
        case "int":
        case "integer": // Added integer as it's common
        case "double":
        case "float":
            mapping.universalType = UniversalType.Number;
            break;
        case "long":
            mapping.universalType = UniversalType.Number;
            mapping.format = UniversalFormat.Long; // Set format for long
            break;
        case "boolean":
            mapping.universalType = UniversalType.Boolean;
            break;
        case "date":
            mapping.universalType = UniversalType.Datetime; // Map Java Date to Universal Datetime
            break;
        case "datetime":
        case "timestamp": // Added timestamp as it's common
            mapping.universalType = UniversalType.Datetime;
            break;
        default:
            // If it's not a primitive type, assume it's a custom class or other type
            mapping.universalType = UniversalType.Other;
            break;
    }
    return { domainSpecificType: javaType, universalType: mapping.universalType, format: mapping.format };
}

/**
 * Translates a universal type to a Java type.
 * @param universalType The universal type to translate.
 * @returns The Java type representation.
 */
export function fromUniversalType(universalType: Type): string {
    switch (universalType.universalType) {
        case UniversalType.String:
            return "String";
        case UniversalType.Number:
            // Handle formats for number types
            if (universalType.format === "long") return "long";
            if (universalType.format === "double") return "double";
            if (universalType.format === "decimal") return "decimal";
            return "int"; // Default to int for numbers
        case UniversalType.Boolean:
            return "boolean";
        case UniversalType.Date:
            return "date";
        case UniversalType.Datetime:
            return "datetime";
        default:
            return "string"; // Default to string for other types
    }
}
