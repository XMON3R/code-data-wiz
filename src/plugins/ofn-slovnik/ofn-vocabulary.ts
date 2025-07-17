/**
 * Maps internal English property names used in TypeScript interfaces
 * to their corresponding Czech keys in the official OFN JSON-LD vocabulary.
 *
 * Used for serializing/unserializing between code and OFN JSON structure.
 */
export const ofnKeyMap: { [key: string]: string } = {
    context: "@context",
    iri: "iri",
    type: "typ",
    name: "název",
    description: "popis",
    createdAt: "vytvořeno",
    updatedAt: "aktualizováno",
    concepts: "pojmy",

    // Nested keys
    "createdAt.type": "vytvořeno.typ",
    "createdAt.date": "datum",
    "updatedAt.type": "aktualizováno.typ",
    "updatedAt.dateTime": "datum_a_čas",

    // Concept-level properties
    "concepts.iri": "iri",
    "concepts.type": "typ",
    "concepts.name": "název",
    "concepts.definition": "definice",
    "concepts.relatedLegalProvision": "související-ustanovení-právního-předpisu",
    "concepts.superConcept": "nadřazený-pojem",
    "concepts.equivalentConcept": "ekvivalentní-pojem",
    "concepts.description": "popis",
    "concepts.subClassOf": "nadřazená-třída",
    "concepts.domain": "definiční-obor",
    "concepts.range": "obor-hodnot",

    // Not part of OFN schema — used internally
    "concepts.ignored": "ignored",

    // Localized labels
    "concepts.name.cs": "cs",
    "concepts.name.en": "en",
    "concepts.definition.cs": "cs",
    "concepts.definition.en": "en",
};

/**
 * Inverse mapping of {@link ofnKeyMap}, used to convert
 * Czech OFN keys back to internal English names.
 */
export const inverseOfnKeyMap: { [key: string]: string } = {};
for (const englishKey in ofnKeyMap) {
    inverseOfnKeyMap[ofnKeyMap[englishKey]] = englishKey;
}
