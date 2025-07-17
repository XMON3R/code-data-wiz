import { Type, UniversalType, UniversalFormat } from "../../data-model-api/universal-model";

interface LinkMLTypeMapping {
    universalType: UniversalType;
    format?: UniversalFormat | string; // Keep string for now as some formats are not in enum
}

/**
 * Translates a LinkML type to a universal type.
 * @param linkMLType The LinkML type to translate.
 * @returns The universal type representation.
 */
export function toUniversalType(linkMLType: string): Type {
    const mapping: LinkMLTypeMapping = {
        universalType: UniversalType.String,
    };
    switch (linkMLType) {
        case "string":
            mapping.universalType = UniversalType.String;
            break;
        case "number":
            mapping.universalType = UniversalType.Number;
            break;
        case "boolean":
            mapping.universalType = UniversalType.Boolean;
            break;
        case "date":
            mapping.universalType = UniversalType.Date;
            break;
        case "datetime":
            mapping.universalType = UniversalType.Datetime;
            break;
        default:
            mapping.universalType = UniversalType.Other;
            break;
    }
    return { domainSpecificType: linkMLType, universalType: mapping.universalType };
}

/**
 * Translates a universal type to a LinkML type.
 * @param universalType The universal type to translate.
 * @returns The LinkML type representation.
 */
export function fromUniversalType(universalType: Type): string {
    switch (universalType.universalType) {
        case UniversalType.String:
            return "string";
        case UniversalType.Number:
            return "number";
        case UniversalType.Boolean:
            return "boolean";
        case UniversalType.Date:
            return "date";
        case UniversalType.Datetime:
            return "datetime";
        default:
            return "string";
    }
}
