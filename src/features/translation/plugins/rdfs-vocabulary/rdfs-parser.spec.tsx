import { expect, test } from 'vitest';
import { SimpleRdfsParser } from "./rdfs-parser";
//import { RdfsVocabulary } from "./rdfs-model";

const parser = new SimpleRdfsParser();

test('should parse basic RDFS classes', async () => {
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

test('should parse RDFS subClassOf', async () => {
  const rdfContent = `
    <http://example.org/Student> a <http://www.w3.org/2000/01/rdf-schema#Class> .
    <http://example.org/Student> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <http://example.org/Person> .
  `;
  const vocabulary = await parser.parse(rdfContent);
  expect(Object.keys(vocabulary.classes).length).toBe(1);
  expect(vocabulary.classes["http://example.org/Student"]?.subClassOf).toEqual(["http://example.org/Person"]);
});

test('should parse RDFS properties with domain and range', async () => {
  const rdfContent = `
    <http://example.org/hasName> a <http://www.w3.org/1999/02/22-rdf-syntax-ns#Property> .
    <http://example.org/hasName> <http://www.w3.org/2000/01/rdf-schema#domain> <http://example.org/Person> .
    <http://example.org/hasName> <http://www.w3.org/2000/01/rdf-schema#range> <http://www.w3.org/2000/01/rdf-schema#Literal> .
  `;
  const vocabulary = await parser.parse(rdfContent);
  expect(Object.keys(vocabulary.properties).length).toBe(1);
  expect(vocabulary.properties["http://example.org/hasName"]?.domain).toEqual(["http://example.org/Person"]);
  expect(vocabulary.properties["http://example.org/hasName"]?.range).toEqual(["http://www.w3.org/2000/01/rdf-schema#Literal"]);
});

test('should handle multiple triples', async () => {
  const rdfContent = `
    <http://example.org/Person> a <http://www.w3.org/2000/01/rdf-schema#Class> .
    <http://example.org/name> a <http://www.w3.org/1999/02/22-rdf-syntax-ns#Property> .
    <http://example.org/name> <http://www.w3.org/2000/01/rdf-schema#domain> <http://example.org/Person> .
  `;
  const vocabulary = await parser.parse(rdfContent);
  expect(Object.keys(vocabulary.classes).length).toBe(1);
  expect(Object.keys(vocabulary.properties).length).toBe(1);
  expect(vocabulary.properties["http://example.org/name"]?.domain).toEqual(["http://example.org/Person"]);
});

test('should ignore comments and empty lines', async () => {
  const rdfContent = `
    # This is a comment
    <http://example.org/ClassA> a <http://www.w3.org/2000/01/rdf-schema#Class> .

    <http://example.org/propA> <http://www.w3.org/2000/01/rdf-schema#domain> <http://example.org/ClassA> .
  `;
  const vocabulary = await parser.parse(rdfContent);
  expect(Object.keys(vocabulary.classes).length).toBe(1);
  expect(Object.keys(vocabulary.properties).length).toBe(1);
});