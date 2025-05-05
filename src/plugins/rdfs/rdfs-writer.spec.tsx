import { expect, test } from "vitest";
import { SimpleRdfsWriter } from "./rdfs-writer";
import { RdfsVocabulary } from "./rdfs-model";

const writer = new SimpleRdfsWriter();

test("should write basic RDFS classes with labels", async () => {
  const vocabulary: RdfsVocabulary = {
    classes: {
      "http://example.org/Person": {
        iri: "http://example.org/Person",
        label: { en: "Person", cs: "Osoba" },
      },
    },
    literals: {},
    datatypes: {},
    properties: {},
  };
  const rdfContent = await writer.write(vocabulary);
  expect(rdfContent).toContain(`<http://example.org/Person> a <http://www.w3.org/2000/01/rdf-schema#Class> .`);
  expect(rdfContent).toContain(`<http://example.org/Person> <http://www.w3.org/2000/01/rdf-schema#label> "Person"@en .`);
  expect(rdfContent).toContain(`<http://example.org/Person> <http://www.w3.org/2000/01/rdf-schema#label> "Osoba"@cs .`);
});

test("should write RDFS classes with subClassOf and comments", async () => {
  const vocabulary: RdfsVocabulary = {
    classes: {
      "http://example.org/Student": {
        iri: "http://example.org/Student",
        subClassOf: ["http://example.org/Person"],
        comment: { en: "A student." },
      },
    },
    literals: {},
    datatypes: {},
    properties: {},
  };
  const rdfContent = await writer.write(vocabulary);
  expect(rdfContent).toContain(`<http://example.org/Student> a <http://www.w3.org/2000/01/rdf-schema#Class> .`);
  expect(rdfContent).toContain(`<http://example.org/Student> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <http://example.org/Person> .`);
  expect(rdfContent).toContain(`<http://example.org/Student> <http://www.w3.org/2000/01/rdf-schema#comment> "A student."@en .`);
});

test("should write RDFS properties with domain and range", async () => {
  const vocabulary: RdfsVocabulary = {
    classes: {},
    literals: {},
    datatypes: {},
    properties: {
      "http://example.org/hasName": {
        iri: "http://example.org/hasName",
        domain: ["http://example.org/Person"],
        range: ["http://www.w3.org/2000/01/rdf-schema#Literal"],
      },
    },
  };
  const rdfContent = await writer.write(vocabulary);
  expect(rdfContent).toContain(`<http://example.org/hasName> a <http://www.w3.org/1999/02/22-rdf-syntax-ns#Property> .`);
  expect(rdfContent).toContain(`<http://example.org/hasName> <http://www.w3.org/2000/01/rdf-schema#domain> <http://example.org/Person> .`);
  expect(rdfContent).toContain(`<http://example.org/hasName> <http://www.w3.org/2000/01/rdf-schema#range> <http://www.w3.org/2000/01/rdf-schema#Literal> .`);
});

test("should handle empty vocabulary", async () => {
  const vocabulary: RdfsVocabulary = {
    classes: {},
    literals: {},
    datatypes: {},
    properties: {},
  };
  const rdfContent = await writer.write(vocabulary);
  expect(rdfContent).toBe("");
});