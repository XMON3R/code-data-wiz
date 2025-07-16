import { expect, test } from "vitest";
import { SimpleCSharpWriter } from "./csharp-writer";
import { CSharpDiagram } from "./csharp-model";

const writer = new SimpleCSharpWriter();

test("should generate C# for a single class", () => {
    const diagram: CSharpDiagram = {
        classes: [
            {
                name: "User",
                type: "class",
                accessModifier: "public",
                properties: [
                    { name: "Id", type: { name: "int" }, accessModifier: "public" },
                    { name: "Name", type: { name: "string" }, accessModifier: "public" },
                ],
                methods: [],
            },
        ],
    };
    const expected = `public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
}
`;
    const result = writer.generateCode(diagram);
    expect(result).toEqual(expected);
});

test("should generate C# for multiple classes", () => {
    const diagram: CSharpDiagram = {
        classes: [
            {
                name: "User",
                type: "class",
                accessModifier: "public",
                properties: [
                    { name: "Id", type: { name: "int" }, accessModifier: "public" },
                    { name: "Name", type: { name: "string" }, accessModifier: "public" },
                ],
                methods: [],
            },
            {
                name: "Post",
                type: "class",
                accessModifier: "public",
                properties: [
                    { name: "PostId", type: { name: "int" }, accessModifier: "public" },
                    { name: "Content", type: { name: "string" }, accessModifier: "public" },
                    { name: "UserId", type: { name: "int" }, accessModifier: "public" },
                ],
                methods: [],
            },
        ],
    };
    const expected = `public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
}


public class Post
{
    public int PostId { get; set; }
    public string Content { get; set; }
    public int UserId { get; set; }
}
`;
    const result = writer.generateCode(diagram);
    expect(result).toEqual(expected);
});

test("should handle classes with different data types and nullable types", () => {
    const diagram: CSharpDiagram = {
        classes: [
            {
                name: "Product",
                type: "class",
                accessModifier: "public",
                properties: [
                    { name: "ProductId", type: { name: "int" }, accessModifier: "public" },
                    { name: "ProductName", type: { name: "string" }, accessModifier: "public" },
                    { name: "Price", type: { name: "decimal", isNullable: true }, accessModifier: "public" },
                    { name: "CreatedDate", type: { name: "DateTime" }, accessModifier: "public" },
                ],
                methods: [],
            },
        ],
    };
    const expected = `public class Product
{
    public int ProductId { get; set; }
    public string ProductName { get; set; }
    public decimal? Price { get; set; }
    public DateTime CreatedDate { get; set; }
}
`;
    const result = writer.generateCode(diagram);
    expect(result).toEqual(expected);
});

test("should handle classes with no properties", () => {
    const diagram: CSharpDiagram = {
        classes: [
            {
                name: "EmptyClass",
                type: "class",
                accessModifier: "public",
                properties: [],
                methods: [],
            },
        ],
    };
    const expected = `public class EmptyClass
{
}
`;
    const result = writer.generateCode(diagram);
    expect(result).toEqual(expected);
});

test("should handle an empty diagram with no classes", () => {
    const diagram: CSharpDiagram = { classes: [] };
    const expected = "";
    const result = writer.generateCode(diagram);
    expect(result).toEqual(expected);
});