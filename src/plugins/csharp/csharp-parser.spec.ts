import { expect, test } from "vitest";
import { CSharpTextParser } from "./csharp-parser";
import { CSharpDiagram, CSharpClassType } from "./csharp-model";

const parser = new CSharpTextParser();

test("should parse a single class into a C# class", async () => {
    const input = `public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
}`;
    const expected: CSharpDiagram = {
        classes: [
            {
                name: "User",
                type: CSharpClassType.Class,
                accessModifier: "public",
                properties: [
                    {
                        name: "Id",
                        type: { name: "int", isNullable: false }, 
                        accessModifier: "public",
                    },
                    {
                        name: "Name",
                        type: { name: "string", isNullable: false }, 
                        accessModifier: "public",
                    },
                ],
                methods: [],
            },
        ],
    };
    const result = await parser.parseText(input);
    expect(result).toEqual(expected);
});

test("should handle read-only properties", async () => {
    const input = `public class ReadOnlyExample
{
    public int Id { get; }
    public string Name { get; }
}`;
    const expected: CSharpDiagram = {
        classes: [
            {
                name: "ReadOnlyExample",
                type: CSharpClassType.Class,
                accessModifier: "public",
                properties: [
                    {
                        name: "Id",
                        type: { name: "int", isNullable: false }, 
                        accessModifier: "public",
                    },
                    {
                        name: "Name",
                        type: { name: "string", isNullable: false }, 
                        accessModifier: "public",
                    },
                ],
                methods: [],
            },
        ],
    };
    const result = await parser.parseText(input);
    expect(result).toEqual(expected);
});

test("should parse multiple classes into multiple C# classes", async () => {
    const input = `public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
}

public class Post
{
    public int PostId { get; set; }
    public string Content { get; set; }
    public int UserId { get; set; }
}`;
    const expected: CSharpDiagram = {
        classes: [
            {
                name: "User",
                type: CSharpClassType.Class,
                accessModifier: "public",
                properties: [
                    { name: "Id", type: { name: "int", isNullable: false }, accessModifier: "public" }, 
                    { name: "Name", type: { name: "string", isNullable: false }, accessModifier: "public" },
                ],
                methods: [],
            },
            {
                name: "Post",
                type: CSharpClassType.Class,
                accessModifier: "public",
                properties: [
                    { name: "PostId", type: { name: "int", isNullable: false }, accessModifier: "public" }, 
                    { name: "Content", type: { name: "string", isNullable: false }, accessModifier: "public" }, 
                    { name: "UserId", type: { name: "int", isNullable: false }, accessModifier: "public" }, 
                ],
                methods: [],
            },
        ],
    };
    const result = await parser.parseText(input);
    expect(result).toEqual(expected);
});

test("should handle different data types and nullable types", async () => {
    const input = `public class Product
{
    public int ProductId { get; set; }
    public string ProductName { get; set; }
    public decimal? Price { get; set; }
    public DateTime CreatedDate { get; set; }
}`;
    const expected: CSharpDiagram = {
        classes: [
            {
                name: "Product",
                type: CSharpClassType.Class,
                accessModifier: "public",
                properties: [
                    { name: "ProductId", type: { name: "int", isNullable: false }, accessModifier: "public" }, 
                    { name: "ProductName", type: { name: "string", isNullable: false }, accessModifier: "public" }, 
                    { name: "Price", type: { name: "decimal", isNullable: true }, accessModifier: "public" }, 
                    { name: "CreatedDate", type: { name: "DateTime", isNullable: false }, accessModifier: "public" }, 
                ],
                methods: [],
            },
        ],
    };
    const result = await parser.parseText(input);
    expect(result).toEqual(expected);
});

test("should handle empty classes", async () => {
    const input = `public class Empty {}`;
    const expected: CSharpDiagram = {
        classes: [{ name: "Empty", type: CSharpClassType.Class, accessModifier: "public", properties: [], methods: [] }],
    };
    const result = await parser.parseText(input);
    expect(result).toEqual(expected);
});

test("should ignore empty lines and extra whitespace", async () => {
    const input = `public class Order { public int OrderId { get; set; } }`;
    const expected: CSharpDiagram = {
        classes: [
            {
                name: "Order",
                type: CSharpClassType.Class,
                accessModifier: "public",
                properties: [{ name: "OrderId", type: { name: "int", isNullable: false }, accessModifier: "public" }], 
                methods: [],
            },
        ],
    };
    const result = await parser.parseText(input);
    expect(result).toEqual(expected);
});

test("should return an empty diagram for an empty input string", async () => {
    const input = "";
    const expected: CSharpDiagram = { classes: [] };
    const result = await parser.parseText(input);
    expect(result).toEqual(expected);
});

test("should ignore text outside of class definitions", async () => {
    const input = `// Note
    public class MyClass { public int Id { get; set; } } /* Comment */`;
    const expected: CSharpDiagram = {
        classes: [
            {
                name: "MyClass",
                type: CSharpClassType.Class,
                accessModifier: "public",
                properties: [{ name: "Id", type: { name: "int", isNullable: false }, accessModifier: "public" }], 
                methods: [],
            },
        ],
    };
    const result = await parser.parseText(input);
    expect(result).toEqual(expected);
});

test("should throw an error for invalid C# code", async () => {
    const input = `public class MyClass { public int Id { get; set }`; // Missing brace
    await expect(parser.parseText(input)).rejects.toThrowError();
});

test("should parse a class with a simple method", async () => {
    const input = `public class Calculator { public int Add(int a, int b) { return a + b; } }`;
    const expected: CSharpDiagram = {
        classes: [
            {
                name: "Calculator", type: CSharpClassType.Class, accessModifier: "public", properties: [],
                methods: [
                    {
                        name: "Add", returnType: { name: "int" },
                        parameters: [
                            { name: "a", type: { name: "int" } },
                            { name: "b", type: { name: "int" } },
                        ],
                        accessModifier: "public", isStatic: false, isAsync: false, isVirtual: false, isOverride: false,
                    },
                ],
            },
        ],
    };
    const result = await parser.parseText(input);
    expect(result).toEqual(expected);
});

test("should parse a class with a static method", async () => {
    const input = `public class Utility { public static int GetCount() { return 10; } }`;
    const expected: CSharpDiagram = {
        classes: [
            {
                name: "Utility", type: CSharpClassType.Class, accessModifier: "public", properties: [],
                methods: [
                    {
                        name: "GetCount", returnType: { name: "int" }, parameters: [],
                        accessModifier: "public", isStatic: true, isAsync: false, isVirtual: false, isOverride: false,
                    },
                ],
            },
        ],
    };
    const result = await parser.parseText(input);
    expect(result).toEqual(expected);
});
