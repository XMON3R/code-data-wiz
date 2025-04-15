// plugins/json-vocabulary/json-vocabulary-model.ts
export interface JsonVocabularyModel {
    "@context": string;
    iri: string;
    typ: string[];
    název: {
      cs: string;
      en: string;
    };
    popis: {
      cs: string;
      en: string;
    };
    vytvořeno: {
      typ: string;
      datum: string;
    };
    aktualizováno: {
      typ: string;
      datum_a_čas: string;
    };
    [key: string]: any;
  }