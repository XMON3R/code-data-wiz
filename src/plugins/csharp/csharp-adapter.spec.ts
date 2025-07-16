import { expect, test } from "vitest";
import { CSharpTextParser } from "./csharp-parser";
import { CSharpDiagram } from "./csharp-model";

const parser = new CSharpTextParser();

test("should parse a single class with properties", async () => {
    const input = `public class User { public int Id { get; set; } public string Name { get; set; } }`;
    const expected: CSharpDiagram = {
        classes: [{
            name: "User", type: "class", accessModifier: "public",
            properties: [
                { name: "Id", type: { name: "int", isNullable: false }, accessModifier: "public", isReadonly: false },
                { name: "Name", type: { name: "string", isNullable: false }, accessModifier: "public", isReadonly: false },
            ],
            methods: [],
        }],
    };
    const result = await parser.parseText(input);
    expect(result).toEqual(expected);
});

test("should handle read-only and nullable properties", async () => {
    const input = `public class Product { public int Id { get; } public decimal? Price { get; set; } }`;
    const expected: CSharpDiagram = {
        classes: [{
            name: "Product", type: "class", accessModifier: "public",
            properties: [
                { name: "Id", type: { name: "int", isNullable: false }, accessModifier: "public", isReadonly: true },
                { name: "Price", type: { name: "decimal", isNullable: true }, accessModifier: "public", isReadonly: false },
            ],
            methods: [],
        }],
    };
    const result = await parser.parseText(input);
    expect(result).toEqual(expected);
});

test("should parse multiple classes", async () => {
    const input = `public class User {} public class Post {}`;
    const expected: CSharpDiagram = {
        classes: [
            { name: "User", type: "class", accessModifier: "public", properties: [], methods: [] },
            { name: "Post", type: "class", accessModifier: "public", properties: [], methods: [] },
        ],
    };
    const result = await parser.parseText(input);
    expect(result).toEqual(expected);
});

test("should handle empty classes", async () => {
    const input = `public class Empty{}`;
    const expected: CSharpDiagram = {
        classes: [{ name: "Empty", type: "class", accessModifier: "public", properties: [], methods: [] }],
    };
    const result = await parser.parseText(input);
    expect(result).toEqual(expected);
});

test("should throw an error for invalid C# code", async () => {
    const input = `public class MyClass { public int Id { get; set }`; // Mismatched brace
    await expect(parser.parseText(input)).rejects.toThrowError();
});

test("should parse a class with a simple method", async () => {
    const input = `public class Calculator { public int Add(int a, int b) { return a + b; } }`;
    const expected: CSharpDiagram = {
        classes: [{
            name: "Calculator", type: "class", accessModifier: "public", properties: [],
            methods: [{
                name: "Add", returnType: { name: "int", isNullable: false },
                parameters: [
                    { name: "a", type: { name: "int", isNullable: false } },
                    { name: "b", type: { name: "int", isNullable: false } },
                ],
                accessModifier: "public", isStatic: false, isAsync: false, isVirtual: false, isOverride: false,
            }],
        }],
    };
    const result = await parser.parseText(input);
    expect(result).toEqual(expected);
});

test("should parse a class with a static async method", async () => {
    const input = `public class API { public static async Task Fetch() {} }`;
    const expected: CSharpDiagram = {
        classes: [{
            name: "API", type: "class", accessModifier: "public", properties: [],
            methods: [{
                name: "Fetch", returnType: { name: "void", isNullable: false },
                parameters: [],
                accessModifier: "public", isStatic: true, isAsync: true, isVirtual: false, isOverride: false,
            }],
        }],
    };
    const result = await parser.parseText(input);
    expect(result).toEqual(expected);
});

test("should ignore comments and text outside classes", async () => {
    const input = `// File comment \n public class Item {} /* end */`;
    const expected: CSharpDiagram = {
        classes: [{ name: "Item", type: "class", accessModifier: "public", properties: [], methods: [] }],
    };
    const result = await parser.parseText(input);
    expect(result).toEqual(expected);
});
