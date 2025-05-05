
export interface JsonldModel {      //DOESNT extend UniversalModel 
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
}
