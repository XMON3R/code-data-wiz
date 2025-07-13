import { describe, it, expect, beforeEach } from 'vitest';
import { JavaAdapter } from './java-adapter';
import { JavaModel } from './java-model';
import { UniversalModel } from '../../data-model-api';

describe('JavaAdapter', () => {
    let adapter: JavaAdapter;
    let mockJavaModel: JavaModel;
    let mockUniversalModel: UniversalModel;

    beforeEach(() => {
        adapter = new JavaAdapter();

        mockJavaModel = {
            packageName: "com.example.models",
            imports: ["java.util.Date"],
            classes: [
                {
                    name: "User",
                    type: "class",
                    accessModifier: "public",
                    fields: [
                        {
                            name: "id",
                            type: "Long",
                            accessModifier: "private",
                            annotations: [{ name: "Id" }],
                        },
                        {
                            name: "CREATION_DATE",
                            type: "Date",
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
                    label: "@file",
                    properties: [
                        { label: "packageName", value: "com.example.models", type: { domainSpecificType: "string" } },
                        { label: "imports", value: '["java.util.Date"]', type: { domainSpecificType: "string[]" } }
                    ]
                },
                {
                    label: "User",
                    properties: [
                        {
                            label: "id",
                            type: { domainSpecificType: "Long" },
                            value: '{"accessModifier":"private","annotations":[{"name":"Id"}]}'
                        },
                        {
                            label: "CREATION_DATE",
                            type: { domainSpecificType: "Date" },
                            value: '{"accessModifier":"public","isStatic":true,"isFinal":true,"annotations":[]}'
                        }
                    ],
                    value: '{"type":"class","accessModifier":"public"}'
                }
            ]
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
