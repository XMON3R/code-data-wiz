import { expect, test } from "vitest";
import { SimpleRdfsParser } from "./rdfs-parser";
//import { RdfsVocabulary } from "./rdfs-model";

const parser = new SimpleRdfsParser();

test("should parse basic RDFS classes", async () => {
  const rdfContent = `
    <http://example.org/Person> a <http://www.w3.org/2000/01/rdf-schema#Class> .
    <http://example.org/Person> <http://www.w3.org/2000/01/rdf-schema#label> "Person"@en .
    <http://example.org/Person> <http://www.w3.org/2000/01/rdf-schema#label> "Osoba"@cs .
  `;
  const vocabulary = await parser.parse(rdfContent);
  expect(Object.keys(vocabulary.classes).length).toBe(1);
  expect(vocabulary.classes["http://example.org/Person"]?.iri).toBe("http://example.org/Person");
  expect(vocabulary.classes["http://example.org/Person"]?.label?.en).toBe("Person");
  expect(vocabulary.classes["http://example.org/Person"]?.label?.cs).toBe("Osoba");
});

test("should parse RDFS subClassOf", async () => {
  const rdfContent = `
    <http://example.org/Student> a <http://www.w3.org/2000/01/rdf-schema#Class> .
    <http://example.org/Student> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <http://example.org/Person> .
  `;
  const vocabulary = await parser.parse(rdfContent);
  expect(Object.keys(vocabulary.classes).length).toBe(1);
  expect(vocabulary.classes["http://example.org/Student"]?.subClassOf).toEqual(["http://example.org/Person"]);
});