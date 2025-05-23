import { UniversalModel, Entity, Property, Type } from "../../data-model-api/universal-model.ts"
import { OfnModel } from "./ofn-model";

//TODO: add a proper type for the OfnModel

export class OfnAdapter {
  //NE async
  async fromJsonVocabulary(model: OfnModel): Promise<UniversalModel> {
    const entities: Entity[] = [];
    const properties: Property[] = [];

    for (const key in model) {
      if (Object.prototype.hasOwnProperty.call(model, key)) {
        const value: any = model[key]; // Use 'any' to handle the variety of data in OfnModel
        let type: Type = {}; // Default to an empty type object, which is valid since Type is an empty interface

        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null) {
          type = {};
        } else if (Array.isArray(value)) {
          type = {};
        } else if (typeof value === 'object' && value !== null) {
          type = {};
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

  async toJsonVocabulary(mainModel: UniversalModel): Promise<OfnModel> {
    const jsonVocabularyData: { [key: string]: any } = {};

    if (mainModel.entities && mainModel.entities.length > 0) {
      const rootEntity = mainModel.entities[0];
      if (rootEntity.properties) {
        rootEntity.properties.forEach(prop => {
          //  More sophisticated logic is needed
          jsonVocabularyData[prop.label] = {}; // Placeholder
        });
      }
    }

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
    };
  }
}