import { DomainTextWriter } from "../../data-model-api/domain-specific-model-api";
import { OfnModel } from "./ofn-model";
import { ofnKeyMap } from "./ofn-vocabulary"; // Use ofnKeyMap for English to Czech

export class OfnWriter implements DomainTextWriter<OfnModel> {
    async writeText(model: OfnModel): Promise<string> {
        try {
            const czechOutput: any = {};

            // Handle top-level properties
            if (model.context) czechOutput[ofnKeyMap.context] = model.context;
            if (model.iri) czechOutput[ofnKeyMap.iri] = model.iri;
            if (model.type) czechOutput[ofnKeyMap.type] = model.type;
            if (model.name) czechOutput[ofnKeyMap.name] = model.name;
            if (model.description) czechOutput[ofnKeyMap.description] = model.description;
            
            // Handle createdAt and updatedAt if they are simple objects
            if (model.createdAt) {
                czechOutput[ofnKeyMap.createdAt] = {
                    [ofnKeyMap["createdAt.type"]]: model.createdAt.type,
                    [ofnKeyMap["createdAt.date"]]: model.createdAt.date,
                };
            }
            if (model.updatedAt) {
                czechOutput[ofnKeyMap.updatedAt] = {
                    [ofnKeyMap["updatedAt.type"]]: model.updatedAt.type,
                    [ofnKeyMap["updatedAt.dateTime"]]: model.updatedAt.dateTime,
                };
            }

            // Handle concepts
            if (model.concepts && model.concepts.length > 0) {
                czechOutput[ofnKeyMap.concepts] = model.concepts.map(concept => {
                    const czechConcept: any = {};
                    if (concept.iri) czechConcept[ofnKeyMap["concepts.iri"]] = concept.iri;
                    if (concept.type) czechConcept[ofnKeyMap["concepts.type"]] = concept.type;
                    if (concept.name) czechConcept[ofnKeyMap["concepts.name"]] = concept.name;
                    if (concept.definition) czechConcept[ofnKeyMap["concepts.definition"]] = concept.definition;
                    if (concept.relatedLegalProvision) czechConcept[ofnKeyMap["concepts.relatedLegalProvision"]] = concept.relatedLegalProvision;
                    if (concept.superConcept) czechConcept[ofnKeyMap["concepts.superConcept"]] = concept.superConcept;
                    if (concept.equivalentConcept) czechConcept[ofnKeyMap["concepts.equivalentConcept"]] = concept.equivalentConcept;
                    if (concept.description) czechConcept[ofnKeyMap["concepts.description"]] = concept.description;
                    
                    // New properties
                    if (concept.subClassOf) czechConcept[ofnKeyMap["concepts.subClassOf"]] = concept.subClassOf;
                    if (concept.domain) czechConcept[ofnKeyMap["concepts.domain"]] = concept.domain;
                    if (concept.range) czechConcept[ofnKeyMap["concepts.range"]] = concept.range;
                    // 'ignored' is an internal property and should not be written back to OFN JSON
                    // if (concept.ignored && Object.keys(concept.ignored).length > 0) czechConcept[ofnKeyMap["concepts.ignored"]] = concept.ignored;

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
