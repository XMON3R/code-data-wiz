import { expect, test } from "vitest";
import { CSharpTextParser } from "./csharp-parser";
import { CSharpDiagram } from "./csharp-model";

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
        type: "class",
        accessModifier: "public",
        properties: [
          {
            name: "Id",
            type: { name: "int" },
            accessModifier: "public",
          },
          {
            name: "Name",
            type: { name: "string" },
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
        type: "class",
        accessModifier: "public",
        properties: [
          {
            name: "Id",
            type: { name: "int" },
            accessModifier: "public",
          },
          {
            name: "Name",
            type: { name: "string" },
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
        type: "class",
        accessModifier: "public",
        properties: [
          {
            name: "Id",
            type: { name: "int" },
            accessModifier: "public",
          },
          {
            name: "Name",
            type: { name: "string" },
            accessModifier: "public",
          },
        ],
        methods: [],
      },
      {
        name: "Post",
        type: "class",
        accessModifier: "public",
        properties: [
          {
            name: "PostId",
            type: { name: "int" },
            accessModifier: "public",
          },
          {
            name: "Content",
            type: { name: "string" },
            accessModifier: "public",
          },
          {
            name: "UserId",
            type: { name: "int" },
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
        type: "class",
        accessModifier: "public",
        properties: [
          {
            name: "ProductId",
            type: { name: "int" },
            accessModifier: "public",
          },
          {
            name: "ProductName",
            type: { name: "string" },
            accessModifier: "public",
          },
          {
            name: "Price",
            type: { name: "decimal" },
            accessModifier: "public",
          },
          {
            name: "CreatedDate",
            type: { name: "DateTime" },
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

test("should handle empty classes", async () => {
  const input = `public class Empty
{
}`;
  const expected: CSharpDiagram = {
    classes: [
      {
        name: "Empty",
        type: "class",
        accessModifier: "public",
        properties: [],
        methods: [],
      },
    ],
  };
  const result = await parser.parseText(input);
  expect(result).toEqual(expected);
});

test("should ignore empty lines and extra whitespace", async () => {
  const input = `

public class Order
{

    public int OrderId { get; set; }

    public DateTime OrderDate { get; set; }

}`;
  const expected: CSharpDiagram = {
    classes: [
      {
        name: "Order",
        type: "class",
        accessModifier: "public",
        properties: [
          {
            name: "OrderId",
            type: { name: "int" },
            accessModifier: "public",
          },
          {
            name: "OrderDate",
            type: { name: "DateTime" },
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

test("should return an empty diagram for an empty input string", async () => {
    const input = "";
    const expected: CSharpDiagram = { classes: [] };
    const result = await parser.parseText(input);
    expect(result).toEqual(expected);
});

test("should ignore text outside of class definitions", async () => {
    const input = `
      // Some text before the class.
      public class MyClass
      {
        public int Id { get; set; }
      }
      /* Some text after the class. */
    `;
    const expected: CSharpDiagram = {
      classes: [
        {
          name: "MyClass",
          type: "class",
          accessModifier: "public",
          properties: [
            {
              name: "Id",
              type: { name: "int" },
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

test("should throw an error for invalid C# code", async () => {
    const input = `public class MyClass
{
    public int Id { get; set
}`;
    await expect(parser.parseText(input)).rejects.toThrowError();
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
        type: "class",
        accessModifier: "public",
        properties: [
          {
            name: "Id",
            type: { name: "int" },
            accessModifier: "public",
          },
          {
            name: "Name",
            type: { name: "string" },
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
        type: "class",
        accessModifier: "public",
        properties: [
          {
            name: "Id",
            type: { name: "int" },
            accessModifier: "public",
          },
          {
            name: "Name",
            type: { name: "string" },
            accessModifier: "public",
          },
        ],
        methods: [],
      },
      {
        name: "Post",
        type: "class",
        accessModifier: "public",
        properties: [
          {
            name: "PostId",
            type: { name: "int" },
            accessModifier: "public",
          },
          {
            name: "Content",
            type: { name: "string" },
            accessModifier: "public",
          },
          {
            name: "UserId",
            type: { name: "int" },
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
        type: "class",
        accessModifier: "public",
        properties: [
          {
            name: "ProductId",
            type: { name: "int" },
            accessModifier: "public",
          },
          {
            name: "ProductName",
            type: { name: "string" },
            accessModifier: "public",
          },
          {
            name: "Price",
            type: { name: "decimal" },
            accessModifier: "public",
          },
          {
            name: "CreatedDate",
            type: { name: "DateTime" },
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

test("should handle empty classes", async () => {
  const input = `public class Empty
{
}`;
  const expected: CSharpDiagram = {
    classes: [
      {
        name: "Empty",
        type: "class",
        accessModifier: "public",
        properties: [],
        methods: [],
      },
    ],
  };
  const result = await parser.parseText(input);
  expect(result).toEqual(expected);
});

test("should ignore empty lines and extra whitespace", async () => {
  const input = `

public class Order
{

    public int OrderId { get; set; }

    public DateTime OrderDate { get; set; }

}`;
  const expected: CSharpDiagram = {
    classes: [
      {
        name: "Order",
        type: "class",
        accessModifier: "public",
        properties: [
          {
            name: "OrderId",
            type: { name: "int" },
            accessModifier: "public",
          },
          {
            name: "OrderDate",
            type: { name: "DateTime" },
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

test("should return an empty diagram for an empty input string", async () => {
    const input = "";
    const expected: CSharpDiagram = { classes: [] };
    const result = await parser.parseText(input);
    expect(result).toEqual(expected);
});

test("should ignore text outside of class definitions", async () => {
    const input = `
      // Some text before the class.
      public class MyClass
      {
        public int Id { get; set; }
      }
      /* Some text after the class. */
    `;
    const expected: CSharpDiagram = {
      classes: [
        {
          name: "MyClass",
          type: "class",
          accessModifier: "public",
          properties: [
            {
              name: "Id",
              type: { name: "int" },
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

test("should throw an error for invalid C# code", async () => {
    const input = `public class MyClass
{
    public int Id { get; set
}`;
    await expect(parser.parseText(input)).rejects.toThrowError();
});
