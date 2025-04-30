// rdfs-parser.ts
import { RdfsVocabulary } from "./rdfs-model";

export interface RdfsParser {
  parse(rdfContent: string): Promise<RdfsVocabulary>;
}

// Basic implementation (you'll need a proper RDF parsing library)
export class SimpleRdfsParser implements RdfsParser {
    async parse(rdfContent: string): Promise<RdfsVocabulary> {
        const vocabulary: RdfsVocabulary = { classes: {}, literals: {}, datatypes: {}, properties: {} };
        const lines = rdfContent.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));
    
        for (const line of lines) {
          const parts = line.match(/<([^>]*)>\s+<([^>]*)>\s+(.+?)\s+\./);
          if (parts && parts.length === 4) {
            const subject = parts[1];
            const predicate = parts[2];
            const objectLiteralOrIri = parts[3];
            const objectIriMatch = objectLiteralOrIri.match(/<([^>]*)>/);
            const objectLiteralMatch = objectLiteralOrIri.match(/"([^"]*)"(?:@(\w+))?/);
            let objectIri: string | undefined;
            let objectLiteralValue: string | undefined;
            let objectLiteralLang: string | undefined;
    
            if (objectIriMatch) {
              objectIri = objectIriMatch[1];
            } else if (objectLiteralMatch) {
              objectLiteralValue = objectLiteralMatch[1];
              objectLiteralLang = objectLiteralMatch[2];
            }
    
            if (predicate === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" && objectIri === "http://www.w3.org/2000/01/rdf-schema#Class") {
              vocabulary.classes[subject] = vocabulary.classes[subject] || { iri: subject };
            } else if (predicate === "http://www.w3.org/2000/01/rdf-schema#subClassOf" && objectIri) {
              vocabulary.classes[subject] = vocabulary.classes[subject] || { iri: subject, subClassOf: [] };
              vocabulary.classes[subject].subClassOf!.push(objectIri);
            } else if (predicate === "http://www.w3.org/2000/01/rdf-schema#label" && objectLiteralValue) {
              vocabulary.classes[subject] = vocabulary.classes[subject] || { iri: subject, label: {} };
              vocabulary.classes[subject].label![objectLiteralLang || ''] = objectLiteralValue;
            } else if (predicate === "http://www.w3.org/2000/01/rdf-schema#comment" && objectLiteralValue) {
              vocabulary.classes[subject] = vocabulary.classes[subject] || { iri: subject, comment: {} };
              vocabulary.classes[subject].comment![objectLiteralLang || ''] = objectLiteralValue;
            } else if (predicate === "http://www.w3.org/2000/01/rdf-schema#domain" && objectIri) {
              vocabulary.properties[subject] = vocabulary.properties[subject] || { iri: subject, domain: [] };
              if (vocabulary.properties[subject].domain) { // Ensure array exists
                vocabulary.properties[subject].domain.push(objectIri);
              }
            } else if (predicate === "http://www.w3.org/2000/01/rdf-schema#range" && objectIri) {
              vocabulary.properties[subject] = vocabulary.properties[subject] || { iri: subject, range: [] };
              if (vocabulary.properties[subject].range) { // Ensure array exists
                vocabulary.properties[subject].range.push(objectIri);
              }
            }
          }
        }
        return vocabulary;
      }
    }