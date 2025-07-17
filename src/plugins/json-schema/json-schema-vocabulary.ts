import { Type, UniversalType, UniversalFormat } from "../../data-model-api/universal-model";

interface JsonSchemaTypeMapping {
    universalType: UniversalType;
    format?: UniversalFormat | string; // Keep string for now as some formats are not in enum
}

/**
 * Translates a JSON Schema type to a universal type.
 * @param linkMLType The JSON Schema type to translate.
 * @returns The universal type representation.
 */
export function toUniversalType(jsonSchemaType: string): Type {
    const mapping: JsonSchemaTypeMapping = {
        universalType: UniversalType.String,
    };
    switch (jsonSchemaType) {
        case "string":
            mapping.universalType = UniversalType.String;
            break;
        case "number":
            mapping.universalType = UniversalType.Number;
            break;
        case "boolean":
            mapping.universalType = UniversalType.Boolean;
            break; // Added break statement
        default:
            mapping.universalType = UniversalType.Other;
            break;
    }
    return { domainSpecificType: jsonSchemaType, universalType: mapping.universalType };
}

/**
 * Translates a universal type to a JSON Schema type.
 * @param universalType The universal type to translate.
 * @returns The JSON Schema type representation.
 */
export function fromUniversalType(universalType: Type): string {
    switch (universalType.universalType) {
        case UniversalType.String:
            return "string";
        case UniversalType.Number:
            return "number";
        case UniversalType.Boolean:
            return "boolean";
        default:
            return "string";
    }
}