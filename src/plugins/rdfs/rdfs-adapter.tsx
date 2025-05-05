// rdfs-adapter.ts
/*import { MainModel, Entity, Property, PrimitiveType } from "../../data-model-api/main-model/main-model"; // Adjust import path as needed
import { RdfsVocabulary, RdfsClass, RdfsLiteral, RdfsDatatype, RdfsProperty } from "./rdfs-model";

export class RdfsAdapter {
  async fromRdfs(vocabulary: RdfsVocabulary): Promise<MainModel> {
    const entities: Entity[] = [];

    // Process Classes
    for (const iri in vocabulary.classes) {
      const rdfsClass = vocabulary.classes[iri];
      const properties: Property[] = [
        { label: "iri", type: { identifier: true }, value: rdfsClass.iri },
        ...(rdfsClass.label ? Object.entries(rdfsClass.label).map(([lang, value]) => ({ label: `label@${lang}`, type: {}, value })) : []),
        ...(rdfsClass.comment ? Object.entries(rdfsClass.comment).map(([lang, value]) => ({ label: `comment@${lang}`, type: {}, value })) : []),
        ...(rdfsClass.subClassOf ? [{ label: "subClassOf", type: {}, value: rdfsClass.subClassOf }] : []),
      ];
      entities.push({ label: rdfsClass.iri, properties });
    }

    // Process Properties
    for (const iri in vocabulary.properties) {
      const rdfsProperty = vocabulary.properties[iri];
      const properties: Property[] = [
        { label: "iri", type: { identifier: true }, value: rdfsProperty.iri },
        ...(rdfsProperty.label ? Object.entries(rdfsProperty.label).map(([lang, value]) => ({ label: `label@${lang}`, type: {}, value })) : []),
        ...(rdfsProperty.comment ? Object.entries(rdfsProperty.comment).map(([lang, value]) => ({ label: `comment@${lang}`, type: {}, value })) : []),
        ...(rdfsProperty.domain ? [{ label: "domain", type: {}, value: rdfsProperty.domain }] : []),
        ...(rdfsProperty.range ? [{ label: "range", type: {}, value: rdfsProperty.range }] : []),
        ...(rdfsProperty.subPropertyOf ? [{ label: "subPropertyOf", type: {}, value: rdfsProperty.subPropertyOf }] : []),
      ];
      entities.push({ label: rdfsProperty.iri, properties });
    }

    // You can extend this to handle rdfs:Literals and rdfs:Datatypes
    // based on how you want to represent them in your MainModel.

    return { entities };
  }

  async toRdfs(mainModel: MainModel): Promise<RdfsVocabulary> {
    const vocabulary: RdfsVocabulary = {
      classes: {},
      literals: {},
      datatypes: {},
      properties: {},
    };

    for (const entity of mainModel.entities) {
      const iriProperty = entity.properties.find(p => p.label === "iri");
      if (iriProperty && typeof iriProperty.value === "string") {
        const iri = iriProperty.value;
        const label: { [key: string]: string } = {};
        const comment: { [key: string]: string } = {};
        const subClassOf: string[] = [];
        const domain: string[] = [];
        const range: string[] = [];
        const subPropertyOf: string[] = [];

        entity.properties.forEach(prop => {
          if (prop.label.startsWith("label@") && typeof prop.value === "string") {
            label[prop.label.substring(6)] = prop.value;
          } else if (prop.label.startsWith("comment@") && typeof prop.value === "string") {
            comment[prop.label.substring(8)] = prop.value;
          } else if (prop.label === "subClassOf" && Array.isArray(prop.value)) {
            subClassOf.push(...prop.value.filter((v): v is string => typeof v === "string"));
          } else if (prop.label === "domain" && Array.isArray(prop.value)) {
            domain.push(...prop.value.filter((v): v is string => typeof v === "string"));
          } else if (prop.label === "range" && Array.isArray(prop.value)) {
            range.push(...prop.value.filter((v): v is string => typeof v === "string"));
          } else if (prop.label === "subPropertyOf" && Array.isArray(prop.value)) {
            subPropertyOf.push(...prop.value.filter((v): v is string => typeof v === "string"));
          }
        });

        // Basic heuristic to determine type (you might need more sophisticated logic)
        if (entity.label === iri) { // Assuming entity label is the IRI for simplicity
          if (domain.length > 0 || range.length > 0 || subPropertyOf.length > 0) {
            vocabulary.properties[iri] = { iri, label, comment, domain, range, subPropertyOf };
          } else if (subClassOf.length > 0) {
            vocabulary.classes[iri] = { iri, label, comment, subClassOf };
          } else {
            vocabulary.classes[iri] = { iri, label, comment }; // Default to class if no other indicators
          }
        }
      }
    }

    return vocabulary;
  }
}*/