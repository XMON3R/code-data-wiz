import { DomainSpecificModel } from "../../data-model-api/domain-specific-model";

/**
 * {@link https://ofn.gov.cz/slovníky/draft/#slovník-příklady-json-ld}
 *
 * This interface defines the structure for OFN vocabularies, using English keys
 * that map to the Czech keys found in the actual OFN JSON data.
 */
export interface OfnModel extends DomainSpecificModel {
    /** Maps to "@context" */
    context?: string;
    /** Maps to "iri" */
    iri?: string;
    /** Maps to "typ" */
    type?: string[];
    /** Maps to "název" */
    name: {
        cs?: string;
        en?: string;
    };
    /** Maps to "popis" */
    description: {
        cs?: string;
        en?: string;
    };
    /** Maps to "vytvořeno" */
    createdAt?: {
        /** Maps to "typ" within "vytvořeno" */
        type: string;
        /** Maps to "datum" */
        date: string;
    };
    /** Maps to "aktualizováno" */
    updatedAt?: {
        /** Maps to "typ" within "aktualizováno" */
        type: string;
        /** Maps to "datum_a_čas" */
        dateTime: string;
    };
    /** Maps to "pojmy" */
    concepts?: Array<OfnModelConcept>;
}

/**
 * Represents a single concept within an OFN vocabulary.
 */
export interface OfnModelConcept {
    /** Maps to "iri" within a concept */
    iri?: string;
    /** Maps to "typ" within a concept */
    type?: string[];
    /** Maps to "název" within a concept */
    name: {
        cs?: string;
        en?: string;
    };
    /** Maps to "definice" within a concept */
    definition?: {
        cs?: string;
        en?: string;
    };
    /** Maps to "související-ustanovení-právního-předpisu" */
    relatedLegalProvision?: string[];
    /** Maps to "nadřazený-pojem" */
    superConcept?: string[];
    /** Maps to "ekvivalentní-pojem" */
    equivalentConcept?: string[];
    /** Maps to "popis" within a concept */
    description?: {
        cs?: string;
    };
    /** Maps to "definiční-obor" for relations and properties */
    domain?: string;
    /** Maps to "obor-hodnot" for relations and properties */
    range?: string;
    /** Maps to "nadřazená-třída" for classes (inheritance) */
    subClassOf?: string[];
    /** Ignored concepts/properties with comments */
    ignored?: {
        [key: string]: string;
    };
}
