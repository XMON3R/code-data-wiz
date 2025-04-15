export interface CSharpCustomVocabTerm {
    id: string;
    label: string;
    description: string;
    relatedTerms: string[];
  }
  
  export interface CSharpCustomVocabModel {
    terms: { [id: string]: CSharpCustomVocabTerm };
  }