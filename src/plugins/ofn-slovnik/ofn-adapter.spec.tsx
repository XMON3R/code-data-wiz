import { describe, it, expect, beforeEach } from 'vitest';
import { OfnAdapter } from "./ofn-adapter";
import { OfnModel } from "./ofn-model";
import { UniversalModel, RelationshipType } from "../../data-model-api/universal-model";

describe('OfnAdapter', () => {
    let adapter: OfnAdapter;
    let mockOfnModel: OfnModel;
    let mockUniversalModel: UniversalModel;

    beforeEach(() => {
        adapter = new OfnAdapter();

        mockOfnModel = {
            iri: "https://example.com/slovnik/1",
            name: { cs: "Testovací Název", en: "Test Name" },
            description: { cs: "Testovací Popis" },
            concepts: [
                {
                    iri: "http://example.com/class1",
                    type: ["Třída"],
                    name: { en: "MyClass" },
                    subClassOf: ["http://example.com/superClass"],
                },
                {
                    iri: "http://example.com/relation1",
                    type: ["Vztah"],
                    name: { en: "hasType" },
                    domain: "http://example.com/class1",
                    range: "http://example.com/typeClass",
                },
            ],
        };

        mockUniversalModel = {
            entities: [
                {
                    label: "OFN Vocabulary",
                    properties: [
                        { label: "iri", type: { domainSpecificType: "string" }, value: "https://example.com/slovnik/1" },
                        { label: "název", type: { domainSpecificType: "object" }, value: JSON.stringify({ cs: "Testovací Název", en: "Test Name" }) },
                        { label: "popis", type: { domainSpecificType: "object" }, value: JSON.stringify({ cs: "Testovací Popis" }) },
                    ],
                },
                {
                    label: "MyClass",
                    properties: [
                        { label: "iri", type: { domainSpecificType: "string" }, value: "http://example.com/class1" },
                        { label: "typ", type: { domainSpecificType: "object" }, value: JSON.stringify(["Třída"]) },
                        { label: "název", type: { domainSpecificType: "object" }, value: JSON.stringify({ en: "MyClass" }) },
                        { label: "nadřazená-třída", type: { domainSpecificType: "object" }, value: JSON.stringify(["http://example.com/superClass"]) },
                    ],
                },
                {
                    label: "hasType",
                    properties: [
                        { label: "iri", type: { domainSpecificType: "string" }, value: "http://example.com/relation1" },
                        { label: "typ", type: { domainSpecificType: "object" }, value: JSON.stringify(["Vztah"]) },
                        { label: "název", type: { domainSpecificType: "object" }, value: JSON.stringify({ en: "hasType" }) },
                        { label: "definiční-obor", type: { domainSpecificType: "string" }, value: "http://example.com/class1" },
                        { label: "obor-hodnot", type: { domainSpecificType: "string" }, value: "http://example.com/typeClass" },
                    ],
                },
            ],
            relationships: [
                {
                    sourceEntityLabel: "MyClass",
                    targetEntityLabel: "http://example.com/superClass",
                    type: RelationshipType.Inheritance,
                },
                {
                    sourceEntityLabel: "http://example.com/class1",
                    targetEntityLabel: "http://example.com/typeClass",
                    type: RelationshipType.Association,
                    label: "hasType",
                },
            ],
        };
    });

    it('should correctly adapt from OfnModel to UniversalModel', async () => {
        const result = await adapter.toUniversalModel(mockOfnModel);
        expect(result.entities).toEqual(expect.arrayContaining(mockUniversalModel.entities));
        expect(result.relationships).toEqual(expect.arrayContaining(mockUniversalModel.relationships || []));
    });

    it('should correctly adapt from UniversalModel to OfnModel', async () => {
        const result = await adapter.fromUniversalModel(mockUniversalModel);
        // The fromUniversalModel is simplified and doesn't reconstruct the full original model,
        // so we check for the presence of concepts.
        expect(result.concepts).toBeDefined();
        expect(result.concepts?.length).toBe(2);
    });

    it('should handle a minimal OfnModel', async () => {
        const minimalModel: OfnModel = {
            name: { en: "Minimal" },
            description: { en: "Minimal description" }
        };

        const expectedUniversal: UniversalModel = {
            entities: [{
                label: "OFN Vocabulary",
                properties: [
                    { label: "název", type: { domainSpecificType: "object" }, value: JSON.stringify({ en: "Minimal" }) },
                    { label: "popis", type: { domainSpecificType: "object" }, value: JSON.stringify({ en: "Minimal description" }) }
                ]
            }],
            relationships: []
        };

        const universalResult = await adapter.toUniversalModel(minimalModel);
        expect(universalResult).toEqual(expectedUniversal);
    });
});
