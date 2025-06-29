import { expect, test } from "vitest";
import SimpleSQLParser from "./sql-parser";
import { SQLDiagram } from "./sql-model";

const parser = new SimpleSQLParser();

test("should parse a single class into a SQL table", () => {
  const input = `class User {
  int id
  String name
}`;
  const expected: SQLDiagram = {
    tables: [
      {
        name: "User",
        columns: [
          { name: "id", type: { name: "INT" } },
          { name: "name", type: { name: "VARCHAR", parameters: [255] } },
        ],
      },
    ],
  };
  const result = parser.parse(input);
  expect(result).toEqual(expected);
});

test("should parse multiple classes into multiple SQL tables", () => {
  const input = `class User {
  int id
  String name
}

class Post {
  int postId
  String content
  int userId
}`;
  const expected: SQLDiagram = {
    tables: [
      {
        name: "User",
        columns: [
          { name: "id", type: { name: "INT" } },
          { name: "name", type: { name: "VARCHAR", parameters: [255] } },
        ],
      },
      {
        name: "Post",
        columns: [
          { name: "postId", type: { name: "INT" } },
          { name: "content", type: { name: "VARCHAR", parameters: [255] } },
          { name: "userId", type: { name: "INT" } },
        ],
      },
    ],
  };
  const result = parser.parse(input);
  expect(result).toEqual(expected);
});

test("should handle different data types", () => {
  const input = `class Product {
  int productId
  String productName
  double price
}`;
  const expected: SQLDiagram = {
    tables: [
      {
        name: "Product",
        columns: [
          { name: "productId", type: { name: "INT" } },
          { name: "productName", type: { name: "VARCHAR", parameters: [255] } },
          { name: "price", type: { name: "DECIMAL", parameters: [10, 2] } },
        ],
      },
    ],
  };
  const result = parser.parse(input);
  expect(result).toEqual(expected);
});

test("should handle empty classes", () => {
  const input = `class Empty {}`;
  const expected: SQLDiagram = {
    tables: [
      {
        name: "Empty",
        columns: [],
      },
    ],
  };
  const result = parser.parse(input);
  expect(result).toEqual(expected);
});

test("should ignore empty lines and extra whitespace", () => {
  const input = `

class Order {

  int orderId

  String orderDate

}`;
  const expected: SQLDiagram = {
    tables: [
      {
        name: "Order",
        columns: [
          { name: "orderId", type: { name: "INT" } },
          { name: "orderDate", type: { name: "VARCHAR", parameters: [255] } },
        ],
      },
    ],
  };
  const result = parser.parse(input);
  expect(result).toEqual(expected);
});

test("should default unknown types to TEXT", () => {
  const input = `class Item {
  int itemId
  bool isActive
  Date createdOn
}`;
  const expected: SQLDiagram = {
    tables: [
      {
        name: "Item",
        columns: [
          { name: "itemId", type: { name: "INT" } },
          { name: "isActive", type: { name: "TEXT" } },
          { name: "createdOn", type: { name: "TEXT" } },
        ],
      },
    ],
  };
  const result = parser.parse(input);
  expect(result).toEqual(expected);
});

// --- NEW TESTS ---

test("should handle a class with no attributes but with whitespace inside", () => {
  const input = `class NoAttributes {

  }`;
  const expected: SQLDiagram = {
    tables: [
      {
        name: "NoAttributes",
        columns: [],
      },
    ],
  };
  const result = parser.parse(input);
  expect(result).toEqual(expected);
});

test("should correctly handle a class with only one attribute", () => {
  const input = `class Singleton {
    String uniqueField
  }`;
  const expected: SQLDiagram = {
    tables: [
      {
        name: "Singleton",
        columns: [{ name: "uniqueField", type: { name: "VARCHAR", parameters: [255] } }],
      },
    ],
  };
  const result = parser.parse(input);
  expect(result).toEqual(expected);
});

test("should handle multiple spaces between type and name", () => {
  const input = `class Room {
    int     roomId
    String  roomName
  }`;
  const expected: SQLDiagram = {
    tables: [
      {
        name: "Room",
        columns: [
            { name: "roomId", type: { name: "INT" } },
            { name: "roomName", type: { name: "VARCHAR", parameters: [255] } }
        ],
      },
    ],
  };
  const result = parser.parse(input);
  expect(result).toEqual(expected);
});

test("should return an empty diagram for an empty input string", () => {
    const input = "";
    const expected: SQLDiagram = { tables: [] };
    const result = parser.parse(input);
    expect(result).toEqual(expected);
});

test("should ignore text outside of class definitions", () => {
    const input = `
      Some text before the class.
      class MyTable {
        int id
      }
      Some text after the class.
    `;
    const expected: SQLDiagram = {
      tables: [
        {
          name: "MyTable",
          columns: [{ name: "id", type: { name: "INT" } }],
        },
      ],
    };
    const result = parser.parse(input);
    expect(result).toEqual(expected);
});