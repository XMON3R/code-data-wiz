import { DomainSpecificModel } from "../../data-model-api/domain-specific-model";

/**
 * {@link  https://ofn.gov.cz/slovníky/draft/#slovník-příklady-json-ld}
 */
export interface OfnModel extends DomainSpecificModel{
    iri?: string;
    name: {
      cs?: string;
      en?: string;
    };
    description: {
      cs?: string;
      en?: string;
    };
    createdAt?: string;
    updatedAt?: string;
  }