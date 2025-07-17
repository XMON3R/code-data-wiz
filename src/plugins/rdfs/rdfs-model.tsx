/**
 * {@link  https://ofn.gov.cz/slovn%C3%ADky/draft/p%C5%99%C3%ADklady/slovn%C3%ADk.ttl}
 */


//this model and the whole vocabulary is right now meant for future devolopment

export interface RdfsResource {
    iri: string;
    label?: { [key: string]: string }; // Language-tagged labels
    comment?: { [key: string]: string }; // Language-tagged comments
  }
  
  export interface RdfsClass extends RdfsResource {
    subClassOf?: string[];
  }
  
  export interface RdfsLiteral extends RdfsResource {
    value: string;
    datatype?: string;
    language?: string;
  }
  
  export interface RdfsDatatype extends RdfsResource {
    subClassOf?: string[]; // Datatypes can be subclasses of other datatypes (though less common in basic RDFS)
  }
  
  export interface RdfsProperty extends RdfsResource {
    range?: string[]; // IRIs of expected range classes or datatypes
    domain?: string[]; // IRIs of expected domain classes
    subPropertyOf?: string[];
  }
  
  export interface RdfsVocabulary {
    classes: { [iri: string]: RdfsClass };
    literals: { [iri: string]: RdfsLiteral };
    datatypes: { [iri: string]: RdfsDatatype };
    properties: { [iri: string]: RdfsProperty };
  }