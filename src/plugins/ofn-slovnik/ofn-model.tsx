
/*export interface OfnModel {  
  "@context": string;
  iri: string;
  type: string[];
  name: {
      cs: string;
      en: string;
  };
  description: {                   
      cs: string;
      en: string;
  };
  created: {
      type: string;
      date: string;
  };
  updated: {
      type: string;
      datetime: string;
  };
  [key: string]: any;
}*/

/*
export interface OfnModel {
    [key: string]: any;
    "@context": string;
    iri: string;
    type: string[];
    name: Record<string, string>;
    description: Record<string, string>;
    created: {
        type: string;
        date: string;
    };
    updated: {
        type: string;
        datetime: string;
    };
}*/

export interface OfnModel {
    "@context"?: string;
    iri?: string;
    type?: string[];
    name?: {
      cs?: string;
      en?: string;
    };
    description?: {
      cs?: string;
      en?: string;
    };
    created?: {
      type?: string;
      date?: string;
    };
    updated?: {
      type?: string;
      datetime?: string;
    };
    [key: string]: any;
  }