// rdfs-writer.ts
import { RdfsVocabulary /*, RdfsClass, RdfsProperty */ } from "./rdfs-model";

export interface RdfsWriter {
  write(vocabulary: RdfsVocabulary): Promise<string>;
}

// Basic implementation (writes in Turtle-like syntax)
export class SimpleRdfsWriter implements RdfsWriter {
  async write(vocabulary: RdfsVocabulary): Promise<string> {
    let output = "";

    for (const iri in vocabulary.classes) {
      const rdfsClass = vocabulary.classes[iri];
      output += `<${rdfsClass.iri}> a <http://www.w3.org/2000/01/rdf-schema#Class> .\n`;
      if (rdfsClass.label) {
        for (const lang in rdfsClass.label) {
          output += `<${rdfsClass.iri}> <http://www.w3.org/2000/01/rdf-schema#label> "${rdfsClass.label[lang]}"${lang ? `@${lang}` : ""} .\n`;
        }
      }
      if (rdfsClass.comment) {
        for (const lang in rdfsClass.comment) {
          output += `<${rdfsClass.iri}> <http://www.w3.org/2000/01/rdf-schema#comment> "${rdfsClass.comment[lang]}"${lang ? `@${lang}` : ""} .\n`;
        }
      }
      if (rdfsClass.subClassOf) {
        for (const superClass of rdfsClass.subClassOf) {
          output += `<${rdfsClass.iri}> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <${superClass}> .\n`;
        }
      }
      output += "\n";
    }

    for (const iri in vocabulary.properties) {
      const rdfsProperty = vocabulary.properties[iri];
      output += `<${rdfsProperty.iri}> a <http://www.w3.org/1999/02/22-rdf-syntax-ns#Property> .\n`;
      if (rdfsProperty.label) {
        for (const lang in rdfsProperty.label) {
          output += `<${rdfsProperty.iri}> <http://www.w3.org/2000/01/rdf-schema#label> "${rdfsProperty.label[lang]}"${lang ? `@${lang}` : ""} .\n`;
        }
      }
      if (rdfsProperty.comment) {
        for (const lang in rdfsProperty.comment) {
          output += `<${rdfsProperty.iri}> <http://www.w3.org/2000/01/rdf-schema#comment> "${rdfsProperty.comment[lang]}"${lang ? `@${lang}` : ""} .\n`;
        }
      }
      if (rdfsProperty.domain) {
        for (const domain of rdfsProperty.domain) {
          output += `<${rdfsProperty.iri}> <http://www.w3.org/2000/01/rdf-schema#domain> <${domain}> .\n`;
        }
      }
      if (rdfsProperty.range) {
        for (const range of rdfsProperty.range) {
          output += `<${rdfsProperty.iri}> <http://www.w3.org/2000/01/rdf-schema#range> <${range}> .\n`;
        }
      }
      if (rdfsProperty.subPropertyOf) {
        for (const subProperty of rdfsProperty.subPropertyOf) {
          output += `<${rdfsProperty.iri}> <http://www.w3.org/2000/01/rdf-schema#subPropertyOf> <${subProperty}> .\n`;
        }
      }
      output += "\n";
    }

    // You would extend this to handle literals and datatypes as needed.

    return output;
  }
}