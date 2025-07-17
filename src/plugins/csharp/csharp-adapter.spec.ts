import { expect, test } from "vitest";
import { CSharpTextParser } from "./csharp-parser";
import { CSharpDiagram } from "./csharp-model";

const parser = new CSharpTextParser();

import { CSharpClassType } from "./csharp-model";

test("should parse a single class with properties", async () => {
    const input = `public class User { public int Id { get; set; } public string Name { get; set; } }`;
    const expected: CSharpDiagram = {
        classes: [{
            name: "User", type: CSharpClassType.Class, accessModifier: "public",
            properties: [
                { name: "Id", type: { name: "int", isNullable: false }, accessModifier: "public"},
                { name: "Name", type: { name: "string", isNullable: false }, accessModifier: "public"},
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
            { name: "User", type: CSharpClassType.Class, accessModifier: "public", properties: [], methods: [] },
            { name: "Post", type: CSharpClassType.Class, accessModifier: "public", properties: [], methods: [] },
        ],
    };
    const result = await parser.parseText(input);
    expect(result).toEqual(expected);
});

test("should handle empty classes", async () => {
    const input = `public class Empty{}`;
    const expected: CSharpDiagram = {
        classes: [{ name: "Empty", type: CSharpClassType.Class, accessModifier: "public", properties: [], methods: [] }],
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
            name: "Calculator", type: CSharpClassType.Class, accessModifier: "public", properties: [],
            methods: [{
                name: "Add", returnType: { name: "int"},
                parameters: [
                    { name: "a", type: { name: "int" } },
                    { name: "b", type: { name: "int" } },
                ],
                accessModifier: "public", isStatic: false, isAsync: false, isVirtual: false, isOverride: false,
            }],
        }],
    };
    const result = await parser.parseText(input);
    expect(result).toEqual(expected);
});

test("should ignore comments and text outside classes", async () => {
    const input = `// File comment \n public class Item {} /* end */`;
    const expected: CSharpDiagram = {
        classes: [{ name: "Item", type: CSharpClassType.Class, accessModifier: "public", properties: [], methods: [] }],
    };
    const result = await parser.parseText(input);
    expect(result).toEqual(expected);
});
