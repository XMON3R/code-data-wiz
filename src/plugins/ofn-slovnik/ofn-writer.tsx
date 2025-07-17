import { DomainTextWriter } from "../../data-model-api/domain-specific-model-api";
import { OfnModel } from "./ofn-model";

export class OfnWriter implements DomainTextWriter<OfnModel> {
    async writeText(model: OfnModel): Promise<string> {
        try {
            const czechOutput: any = {};

            // Handle top-level properties
            if (model.context) czechOutput["@context"] = model.context;
            if (model.iri) czechOutput["iri"] = model.iri;
            if (model.type) czechOutput["typ"] = model.type;
            if (model.name) czechOutput["název"] = model.name;
            if (model.description) czechOutput["popis"] = model.description;

            // Handle createdAt and updatedAt
            if (model.createdAt) {
                czechOutput["vytvořeno"] = {
                    "typ": model.createdAt.type,
                    "datum": model.createdAt.date,
                };
            }
            if (model.updatedAt) {
                czechOutput["aktualizováno"] = {
                    "typ": model.updatedAt.type,
                    "datum_a_čas": model.updatedAt.dateTime,
                };
            }

            // Handle concepts
            if (model.concepts && model.concepts.length > 0) {
                czechOutput["pojmy"] = model.concepts.map(concept => {
                    const czechConcept: any = {};
                    if (concept.iri) czechConcept["iri"] = concept.iri;
                    if (concept.type) czechConcept["typ"] = concept.type;
                    if (concept.name) czechConcept["název"] = concept.name;
                    if (concept.definition) czechConcept["definice"] = concept.definition;
                    if (concept.relatedLegalProvision) czechConcept["související-ustanovení-právního-předpisu"] = concept.relatedLegalProvision;
                    if (concept.superConcept) czechConcept["nadřazený-pojem"] = concept.superConcept;
                    if (concept.equivalentConcept) czechConcept["ekvivalentní-pojem"] = concept.equivalentConcept;
                    if (concept.description) czechConcept["popis"] = concept.description;
                    if (concept.subClassOf) czechConcept["nadřazená-třída"] = concept.subClassOf;
                    if (concept.domain) czechConcept["definiční-obor"] = concept.domain;
                    if (concept.range) czechConcept["obor-hodnot"] = concept.range;
                    return czechConcept;
                });
            }

            return JSON.stringify(czechOutput, null, 2);
        } catch (error) {
            console.error("Error writing OFN JSON:", error);
            throw new Error("Failed to write OFN JSON");
        }
    }
}
