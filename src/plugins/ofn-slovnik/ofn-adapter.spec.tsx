/*import { describe, it, expect, beforeEach } from 'vitest';
import { OfnAdapter } from "./ofn-adapter";
import { OfnModel } from "./ofn-model";
import { UniversalModel } from "../../data-model-api/universal-model";

describe('OfnAdapter', () => {
  let adapter: OfnAdapter;
  let mockOfnModel: OfnModel;
  let mockUniversalModel: UniversalModel;

  beforeEach(() => {
    adapter = new OfnAdapter();

    // A valid OfnModel instance that conforms to the interface
    mockOfnModel = {
      iri: "https://example.com/slovnik/1",
      name: { cs: "Testovací Název", en: "Test Name" },
      description: { cs: "Testovací Popis" },
      createdAt: "2025-01-01T00:00:00Z",
    };

    // The expected UniversalModel representation after conversion
    mockUniversalModel = {
      entities: [
        {
          label: "OFN Vocabulary",
          properties: [
            { label: "iri", type: { domainSpecificType: "string" }, value: "https://example.com/slovnik/1" },
            { label: "name", type: { domainSpecificType: "object" }, value: JSON.stringify({ cs: "Testovací Název", en: "Test Name" }) },
            { label: "description", type: { domainSpecificType: "object" }, value: JSON.stringify({ cs: "Testovací Popis" }) },
            { label: "createdAt", type: { domainSpecificType: "string" }, value: "2025-01-01T00:00:00Z" },
          ],
        },
      ],
    };
  });

  it('should correctly adapt from OfnModel to UniversalModel', async () => {
    const result = await adapter.toUniversalModel(mockOfnModel);
    expect(result).toEqual(mockUniversalModel);
  });

  it('should correctly adapt from UniversalModel to OfnModel', async () => {
    const result = await adapter.fromUniversalModel(mockUniversalModel);
    expect(result).toEqual(mockOfnModel);
  });

  it('should maintain data consistency after a full conversion cycle', async () => {
    // Step 1: OfnModel -> UniversalModel
    const universal = await adapter.toUniversalModel(mockOfnModel);
    
    // Step 2: UniversalModel -> OfnModel
    const finalOfn = await adapter.fromUniversalModel(universal);

    // The final result should be identical to the original model
    expect(finalOfn).toEqual(mockOfnModel);
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
                { label: "name", type: { domainSpecificType: "object" }, value: JSON.stringify({ en: "Minimal" }) },
                { label: "description", type: { domainSpecificType: "object" }, value: JSON.stringify({ en: "Minimal description" }) }
            ]
        }]
    };

    const universalResult = await adapter.toUniversalModel(minimalModel);
    expect(universalResult).toEqual(expectedUniversal);

    const finalOfnResult = await adapter.fromUniversalModel(universalResult);
    expect(finalOfnResult).toEqual(minimalModel);
  });
});
*/