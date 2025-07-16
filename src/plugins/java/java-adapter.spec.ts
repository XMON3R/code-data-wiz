import { describe, it, expect, beforeEach } from 'vitest';
import { JavaAdapter } from './java-adapter';
import { JavaModel } from './java-model';
import { UniversalModel } from '../../data-model-api';

describe('JavaAdapter', () => {
    let adapter: JavaAdapter;
    let mockJavaModel: JavaModel;

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
                        { name: "id", type: "Long", accessModifier: "private", annotations: [{ name: "Id" }] }
                    ],
                    methods: [
                        {
                            name: "getUsername",
                            returnType: "String",
                            accessModifier: "public",
                            parameters: [],
                            annotations: [],
                        }
                    ],
                }
            ]
        };
    });

    it('should correctly convert a full JavaModel to a UniversalModel', async () => {
        const universal = await adapter.toUniversalModel(mockJavaModel);
        
        const userEntity = universal.entities.find(e => e.label === "User");
        expect(userEntity).toBeDefined();
        
        const idProp = userEntity?.properties.find(p => p.label === "id");
        expect(idProp).toBeDefined();
        expect(JSON.parse(idProp?.value).isField).toBe(true);

        const methodProp = userEntity?.properties.find(p => p.label === "getUsername");
        expect(methodProp).toBeDefined();
        expect(JSON.parse(methodProp?.value).isMethod).toBe(true);
        expect(methodProp?.type.domainSpecificType).toBe("String");
    });

    it('should maintain data consistency after a full conversion cycle', async () => {
        // Convert to Universal and back to Java
        const universal = await adapter.toUniversalModel(mockJavaModel);
        const finalJava = await adapter.fromUniversalModel(universal);

        // Clean objects by removing undefined keys for stable comparison
        const cleanedFinal = JSON.parse(JSON.stringify(finalJava));
        const cleanedMock = JSON.parse(JSON.stringify(mockJavaModel));

        expect(cleanedFinal).toEqual(cleanedMock);
    });

    it('should handle models with no methods', async () => {
        const modelWithoutMethods: JavaModel = {
            ...mockJavaModel,
            classes: [{ ...mockJavaModel.classes[0], methods: [] }]
        };

        const universal = await adapter.toUniversalModel(modelWithoutMethods);
        const finalJava = await adapter.fromUniversalModel(universal);

        const cleanedFinal = JSON.parse(JSON.stringify(finalJava));
        const cleanedMock = JSON.parse(JSON.stringify(modelWithoutMethods));

        expect(cleanedFinal).toEqual(cleanedMock);
    });
});
