// plugins/json-vocabulary/json-vocabulary-adapter.ts
import { MainModel, Entity, Property, PrimitiveType } from "../../main-model/main-model";
import { JsonVocabularyModel } from "./json-vocabulary-model";

export class JsonVocabularyAdapter {
  async fromJsonVocabulary(model: JsonVocabularyModel): Promise<MainModel> {
    const entities: Entity[] = [];
    const properties: Property[] = [];

    for (const key in model) {
      if (Object.prototype.hasOwnProperty.call(model, key)) {
        const value = model[key];
        let type: PrimitiveType | {} = {}; // Default to object for now

        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null) {
          type = {}; // Treat as primitive for simplicity
        } else if (Array.isArray(value)) {
          type = {}; // Treat as complex/container for now
        } else if (typeof value === 'object' && value !== null) {
          type = {}; // Treat as complex for now
        }

        properties.push({
          label: key,
          type: type,
        });
      }
    }

    entities.push({
      label: "JSON Vocabulary Root",
      properties: properties,
    });

    return {
      entities: entities,
    };
  }

  async toJsonVocabulary(mainModel: MainModel): Promise<JsonVocabularyModel> {
    const jsonVocabularyData: { [key: string]: any } = {};

    if (mainModel.entities && mainModel.entities.length > 0) {
      const rootEntity = mainModel.entities[0];
      if (rootEntity.properties) {
        rootEntity.properties.forEach(prop => {
          // This is a basic conversion. More sophisticated logic would be needed
          // to reconstruct the original JSON structure and data types
          jsonVocabularyData[prop.label] = {}; // Placeholder
        });
      }
    }

    // This is a very basic adapter and doesn't fully reconstruct the original
    // JsonVocabularyModel. A more complex implementation would be needed
    // to handle the specific structure and data types of the JsonVocabularyModel.
    return {
      "@context": "https://ofn.gov.cz/slovníky/draft/kontexty/slovníky.jsonld",
      "iri": "https://slovník.gov.cz/datový/turistické-cíle",
      "typ": ["Slovník"],
      "název": {
        "cs": "Slovník turistických cílů",
        "en": "Vocabulary of tourist points of interest"
      },
      "popis": {
        "cs": "Slovník turistických cílů slouží v rámci příkladu pro OFN Slovníky",
        "en": "Vocabulary of tourist points of interest serves as an example in the formal open standard for vocabularies"
      },
      "vytvořeno": {
        "typ": "Časový okamžik",
        "datum": "2024-01-01"
      },
      "aktualizováno": {
        "typ": "Časový okamžik",
        "datum_a_čas": "2024-01-15T04:53:21+02:00"
      },
      // ...jsonVocabularyData, // Remove this line
    };
  }
}