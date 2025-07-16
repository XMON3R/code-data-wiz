import { expect, test } from "vitest";
import { CSharpAdapter } from "./csharp-adapter";
import { CSharpModel } from "./csharp-model";
import { UniversalModel } from "../../data-model-api/universal-model";

const adapter = new CSharpAdapter();

test("should convert a C# model to a universal model with metadata", async () => {
    const csharpModel: CSharpModel = {
        classes: [
            {
                name: "User",
                type: "class",
                accessModifier: "public",
                properties: [
                    { name: "Id", type: { name: "int" }, accessModifier: "public" },
                    { name: "Name", type: { name: "string", isNullable: true }, accessModifier: "private" },
                ],
                methods: [],
            },
        ],
    };

    const expected: UniversalModel = {
        entities: [
            {
                label: "User",
                properties: [
                    {
                        label: "Id",
                        type: { domainSpecificType: "int" },
                        value: JSON.stringify({ accessModifier: "public", isNullable: false }),
                    },
                    {
                        label: "Name",
                        type: { domainSpecificType: "string" },
                        value: JSON.stringify({ accessModifier: "private", isNullable: true }),
                    },
                ],
                value: JSON.stringify({ type: "class", accessModifier: "public" }),
            },
        ],
    };

    const result = await adapter.toUniversalModel(csharpModel);
    expect(result).toEqual(expected);
});

test("should convert a universal model with metadata to a C# model", async () => {
    const universalModel: UniversalModel = {
        entities: [
            {
                label: "Product",
                properties: [
                    {
                        label: "ProductId",
                        type: { domainSpecificType: "int" },
                        value: JSON.stringify({ accessModifier: "public", isNullable: false }),
                    },
                    {
                        label: "Price",
                        type: { domainSpecificType: "decimal" },
                        value: JSON.stringify({ accessModifier: "public", isNullable: true }),
                    },
                ],
                value: JSON.stringify({ type: "class", accessModifier: "public" }),
            },
        ],
    };

    const expected: CSharpModel = {
        classes: [
            {
                name: "Product",
                type: "class",
                accessModifier: "public",
                properties: [
                    { name: "ProductId", type: { name: "int", isNullable: false }, accessModifier: "public" },
                    { name: "Price", type: { name: "decimal", isNullable: true }, accessModifier: "public" },
                ],
                methods: [],
            },
        ],
    };

    const result = await adapter.fromUniversalModel(universalModel);
    expect(result).toEqual(expected);
});

test("should handle empty models", async () => {
    const emptyCSharpModel: CSharpModel = { classes: [] };
    const universalModel = await adapter.toUniversalModel(emptyCSharpModel);
    expect(universalModel.entities).toEqual([]);

    const emptyUniversalModel: UniversalModel = { entities: [] };
    const csharpModel = await adapter.fromUniversalModel(emptyUniversalModel);
    expect(csharpModel.classes).toEqual([]);
});
