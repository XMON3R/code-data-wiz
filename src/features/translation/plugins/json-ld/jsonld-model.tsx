import { CommonModel } from "../../parsers/common-model"; // Adjust path if necessary

export interface VocabularyEntry extends CommonModel {
  iri: string;
  type: string[]; // Array of types, e.g., ["Vocabulary"]
  name: {
    en: string; // English name
  };
  description: {
    en: string; // English description
  };
  created: {
    type: string; // e.g., "DateTime"
    date: string; // Date string
  };
  updated: {
    type: string;
    datetime: string; // Date-time string
  };
}

export interface Relationship {
  // Define the structure of Relationship when known
}
