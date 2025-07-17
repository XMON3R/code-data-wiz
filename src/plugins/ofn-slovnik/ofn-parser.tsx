import { OfnModel, OfnModelConcept } from "./ofn-model";
import { DomainTextParser } from "../../data-model-api/domain-specific-model-api";

/**
 * A parser for OFN JSON-LD text that converts it into an {@link OfnModel}.
 * 
 * It handles parsing the top-level structure as well as individual concepts,
 * and applies basic filtering and enrichment (e.g., inheritance, domain/range handling).
 */
export class OfnParser implements DomainTextParser<OfnModel> {
    /**
     * Parses raw OFN JSON-LD text into a structured {@link OfnModel}.
     *
     * - Filters out or marks concepts like "Koncept" and "Pojem" unless they are meaningful types.
     * - Handles inheritance (`subClassOf`) for classes.
     * - Maps domain/range info for relations and properties.
     * - Preserves unmapped top-level keys in the final model.
     *
     * @param {string} text - A JSON string representing OFN vocabulary.
     * @returns {Promise<OfnModel>} A structured OFN model.
     * @throws Will throw an error if parsing fails or input is invalid.
     */
    async parseText(text: string): Promise<OfnModel> {
        try {
            const rawData = JSON.parse(text);

            const ofnModel: OfnModel = {
                context: rawData["@context"],
                iri: rawData.iri,
                type: rawData.typ,
                name: rawData.název,
                description: rawData.popis,
                createdAt: rawData.vytvořeno
                    ? {
                        type: rawData.vytvořeno.typ,
                        date: rawData.vytvořeno.datum || rawData.vytvořeno.datum_a_čas,
                    }
                    : undefined,
                updatedAt: rawData.aktualizováno
                    ? {
                        type: rawData.aktualizováno.typ,
                        dateTime: rawData.aktualizováno.datum || rawData.aktualizováno.datum_a_čas,
                    }
                    : undefined,
                concepts: [],
            };

            if (rawData.pojmy && Array.isArray(rawData.pojmy)) {
                ofnModel.concepts = rawData.pojmy
                    .map((rawConcept: any) => {
                        const concept: OfnModelConcept = {
                            iri: rawConcept.iri,
                            type: rawConcept.typ,
                            name: rawConcept.název,
                            definition: rawConcept.definice,
                            relatedLegalProvision: rawConcept.související_ustanovení_právního_předpisu,
                            equivalentConcept: rawConcept.ekvivalentní_pojem,
                            description: rawConcept.popis,
                            ignored: {},
                        };

                        // Ignore pure "Koncept" and "Pojem" types unless they have meaningful roles
                        if (concept.type?.includes("Koncept") || concept.type?.includes("Pojem")) {
                            if (
                                !concept.type?.includes("Třída") &&
                                !concept.type?.includes("Vztah") &&
                                !concept.type?.includes("Vlastnost")
                            ) {
                                concept.ignored!["Koncept/Pojem"] = "Ignored as per OFN rules.";
                            }
                        }

                        // Inheritance (classes)
                        if (concept.type?.includes("Třída")) {
                            concept.subClassOf = rawConcept["nadřazená-třída"];
                        }

                        // Domain/range (relations & properties)
                        if (concept.type?.includes("Vztah") || concept.type?.includes("Vlastnost")) {
                            concept.domain = rawConcept["definiční-obor"];
                            concept.range = rawConcept["obor-hodnot"];
                        }

                        // Ignore certain unsupported fields
                        if (rawConcept["nadřazený-vztah"]) {
                            concept.ignored!["nadřazený-vztah"] = "Ignored as per OFN rules.";
                        }

                        return concept;
                    })
                    .filter((concept: OfnModelConcept | null): concept is OfnModelConcept => concept !== null);
            }

            // Preserve extra unmapped top-level fields
            Object.keys(rawData).forEach((key) => {
                if (
                    !(key in ofnModel) &&
                    !["název", "popis", "vytvořeno", "aktualizováno", "pojmy", "iri"].includes(key)
                ) {
                    (ofnModel as any)[key] = rawData[key];
                }
            });

            return ofnModel;
        } catch (error) {
            console.error("Error parsing OFN JSON:", error);
            throw new Error("Failed to parse OFN JSON");
        }
    }
}
