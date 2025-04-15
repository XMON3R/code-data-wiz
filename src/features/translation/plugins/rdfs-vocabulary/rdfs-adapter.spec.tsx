import { expect, test, beforeEach } from 'vitest';
import { RdfsAdapter } from "./rdfs-adapter";
import { RdfsVocabulary } from "./rdfs-model";
import { MainModel } from "../../main-model/main-model"; // Adjust import path as needed

let adapter: RdfsAdapter;
let mockRdfsVocabulary: RdfsVocabulary;
let mockMainModel: MainModel;

beforeEach(() => {
  adapter = new RdfsAdapter();
  mockRdfsVocabulary = {
    classes: {
      "http://example.org/Person": {
        iri: "http://example.org/Person",
        label: { en: "Person", cs: "Osoba" },
        comment: { en: "A human being.", cs: "Lidská bytost." },
        subClassOf: ["http://example.org/Agent"],
      },
      "http://example.org/Agent": {
        iri: "http://example.org/Agent",
        label: { en: "Agent" },
      },
    },
    literals: {},
    datatypes: {},
    properties: {
      "http://example.org/name": {
        iri: "http://example.org/name",
        label: { en: "name", cs: "jméno" },
        domain: ["http://example.org/Person"],
        range: ["rdfs:Literal"],
      },
      "http://example.org/knows": {
        iri: "http://example.org/knows",
        domain: ["http://example.org/Person"],
        range: ["http://example.org/Person"],
      },
    },
  };

  mockMainModel = {
    entities: [
      {
        label: "http://example.org/Person",
        properties: [
          { label: "iri", type: { identifier: true }, value: "http://example.org/Person" },
          { label: "label@en", type: {}, value: "Person" },
          { label: "label@cs", type: {}, value: "Osoba" },
          { label: "comment@en", type: {}, value: "A human being." },
          { label: "comment@cs", type: {}, value: "Lidská bytost." },
          { label: "subClassOf", type: {}, value: ["http://example.org/Agent"] },
        ],
      },
      {
        label: "http://example.org/Agent",
        properties: [
          { label: "iri", type: { identifier: true }, value: "http://example.org/Agent" },
          { label: "label@en", type: {}, value: "Agent" },
        ],
      },
      {
        label: "http://example.org/name",
        properties: [
          { label: "iri", type: { identifier: true }, value: "http://example.org/name" },
          { label: "label@en", type: {}, value: "name" },
          { label: "label@cs", type: {}, value: "jméno" },
          { label: "domain", type: {}, value: ["http://example.org/Person"] },
          { label: "range", type: {}, value: ["rdfs:Literal"] },
        ],
      },
      {
        label: "http://example.org/knows",
        properties: [
          { label: "iri", type: { identifier: true }, value: "http://example.org/knows" },
          { label: "domain", type: {}, value: ["http://example.org/Person"] },
          { label: "range", type: {}, value: ["http://example.org/Person"] },
        ],
      },
    ],
  };
});

test("should correctly adapt from RdfsVocabulary to MainModel", async () => {
  const mainModel = await adapter.fromRdfs(mockRdfsVocabulary);
  expect(mainModel.entities.length).toBe(4); // Two classes and two properties

  const personEntity = mainModel.entities.find(e => e.label === "http://example.org/Person");
  expect(personEntity).toBeDefined();
  expect(personEntity?.properties.find(p => p.label === "label@en")?.value).toBe("Person");
  expect(personEntity?.properties.find(p => p.label === "subClassOf")?.value).toEqual(["http://example.org/Agent"]);

  const namePropertyEntity = mainModel.entities.find(e => e.label === "http://example.org/name");
  expect(namePropertyEntity).toBeDefined();
  expect(namePropertyEntity?.properties.find(p => p.label === "domain")?.value).toEqual(["http://example.org/Person"]);
  expect(namePropertyEntity?.properties.find(p => p.label === "range")?.value).toEqual(["rdfs:Literal"]);
});

test("should correctly adapt from MainModel to RdfsVocabulary (basic)", async () => {
  const rdfsVocabulary = await adapter.toRdfs(mockMainModel);
  expect(Object.keys(rdfsVocabulary.classes).length).toBe(2);
  expect(rdfsVocabulary.classes["http://example.org/Person"]?.label?.en).toBe("Person");
  expect(rdfsVocabulary.classes["http://example.org/Person"]?.subClassOf).toEqual(["http://example.org/Agent"]);
  expect(Object.keys(rdfsVocabulary.properties).length).toBe(2);
  expect(rdfsVocabulary.properties["http://example.org/name"]?.domain).toEqual(["http://example.org/Person"]);
  expect(rdfsVocabulary.properties["http://example.org/knows"]?.range).toEqual(["http://example.org/Person"]);
});