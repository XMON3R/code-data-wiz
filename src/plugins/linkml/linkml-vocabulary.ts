import { Type } from "../../data-model-api/universal-model";

interface LinkMLTypeMapping {
    universalType: "string" | "number" | "boolean" | "date" | "datetime" | "other";
    format?: string;
}

/**
 * A vocabulary of common LinkML types.
 */
export const LinkMLVocabulary: Record<string, LinkMLTypeMapping> = {
    "string": { universalType: "string" },
    "integer": { universalType: "number" },
    "float": { universalType: "number" },
    "double": { universalType: "number" },
    "decimal": { universalType: "number" },
    "boolean": { universalType: "boolean" },
    "date": { universalType: "date" },
    "datetime": { universalType: "datetime" },
    "uriorcurie": { universalType: "string", format: "uri" },
    "uri": { universalType: "string", format: "uri" },
    "curie": { universalType: "string", format: "curie" },
    "ncname": { universalType: "string" },
    "objectidentifier": { universalType: "string" },
    "nodeidentifier": { universalType: "string" },
};

/**
 * Translates a LinkML type to a universal type.
 * @param linkmlType The LinkML type to translate.
 * @returns The universal type representation.
 */
export function toUniversalType(linkmlType: string): Type {
    const mapping = LinkMLVocabulary[linkmlType.toLowerCase()];
    if (mapping) {
        return {
            domainSpecificType: linkmlType,
            universalType: mapping.universalType,
            ...(mapping.format && { format: mapping.format }),
        };
    }
    return { domainSpecificType: linkmlType, universalType: "other" };
}

/**
 * Translates a universal type to a LinkML type.
 * @param universalType The universal type to translate.
 * @returns The LinkML type representation.
 */
export function fromUniversalType(universalType: Type): string {
    if (universalType.universalType) {
        for (const linkmlType in LinkMLVocabulary) {
            const mapping = LinkMLVocabulary[linkmlType];
            if (mapping.universalType === universalType.universalType && (!mapping.format || mapping.format === universalType.format)) {
                return linkmlType;
            }
        }
    }
    return universalType.domainSpecificType || "string";
}
