import { describe, it, expect, beforeEach } from 'vitest';
import { JavaAdapter } from './java-adapter';
import { JavaModel, JavaClassType } from './java-model';
import { UniversalModel, UniversalType, UniversalFormat } from '../../data-model-api/universal-model';

describe('JavaAdapter', () => {
    let adapter: JavaAdapter;
    let mockJavaModel: JavaModel;
    let mockUniversalModel: UniversalModel;

    beforeEach(() => {
        adapter = new JavaAdapter();

        mockJavaModel = {
            classes: [
                {
                    name: "User",
                    type: JavaClassType.Class,
                    accessModifier: "public",
                    fields: [
                        {
                            name: "id",
                            type: "long",
                            accessModifier: "private",
                            annotations: [{ name: "Id" }],
                        },
                        {
                            name: "CREATION_DATE",
                            type: "datetime",
                            accessModifier: "public",
                            isStatic: true,
                            isFinal: true,
                            annotations: [],
                        }
                    ],
                    methods: [],
                }
            ]
        };

        mockUniversalModel = {
            entities: [
                {
                    label: "User",
                    properties: [
                        {
                            label: "id",
                            type: { domainSpecificType: "long", 
                            format: UniversalFormat.Long,
                            universalType: UniversalType.Number,
                            },
                            value: '{"accessModifier":"private","annotations":[{"name":"Id"}]}'
                        },
                        {
                            label: "CREATION_DATE",
                            type: { domainSpecificType: "datetime",
                            universalType: UniversalType.Datetime,
                            },
                            value: '{"accessModifier":"public","isStatic":true,"isFinal":true,"annotations":[]}'
                        }
                    ],
                    value: '{"type":"class","accessModifier":"public"}'
                }
            ],
            "relationships": [],
        };
    });

    it('should correctly convert JavaModel to UniversalModel', async () => {
        const result = await adapter.toUniversalModel(mockJavaModel);
        expect(result).toEqual(mockUniversalModel);
    });

    it('should correctly convert UniversalModel to JavaModel', async () => {
        const result = await adapter.fromUniversalModel(mockUniversalModel);
        // Clean up undefined properties for a stable comparison
        const cleanedResult = JSON.parse(JSON.stringify(result));
        const cleanedMock = JSON.parse(JSON.stringify(mockJavaModel));
        expect(cleanedResult).toEqual(cleanedMock);
    });

    it('should maintain data consistency after a full conversion cycle', async () => {
        const universal = await adapter.toUniversalModel(mockJavaModel);
        const finalJava = await adapter.fromUniversalModel(universal);

        // Deep equality check after a round trip
        const cleanedFinal = JSON.parse(JSON.stringify(finalJava));
        const cleanedMock = JSON.parse(JSON.stringify(mockJavaModel));
        expect(cleanedFinal).toEqual(cleanedMock);
    });
});
