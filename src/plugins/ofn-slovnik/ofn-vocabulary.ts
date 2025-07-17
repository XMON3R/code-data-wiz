// Mapping from English interface keys to Czech JSON keys
export const ofnKeyMap: { [key: string]: string } = {
    context: "@context",
    iri: "iri",
    type: "typ",
    name: "název",
    description: "popis",
    createdAt: "vytvořeno",
    updatedAt: "aktualizováno",
    concepts: "pojmy",
    "createdAt.type": "vytvořeno.typ",
    "createdAt.date": "vytvořeno.datum",
    "updatedAt.type": "aktualizováno.typ",
    "updatedAt.dateTime": "aktualizováno.datum_a_čas",
    // Mappings for concept properties
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
    "concepts.ignored": "ignored", // Not a real OFN key, but used for internal tracking
};

// Inverse mapping for converting Czech keys back to English
export const inverseOfnKeyMap: { [key: string]: string } = {};
for (const englishKey in ofnKeyMap) {
    inverseOfnKeyMap[ofnKeyMap[englishKey]] = englishKey;
}
