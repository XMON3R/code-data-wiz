import { expect, test } from "vitest";
import { SimpleSQLWriter } from "./sql-writer";
import { SQLDiagram } from "./sql-model";

const writer = new SimpleSQLWriter();

test("should generate SQL for a single table", () => {
  const diagram: SQLDiagram = {
    tables: [
      {
        name: "User",
        columns: [
          { name: "id", type: "INT" },
          { name: "name", type: "VARCHAR(255)" },
        ],
      },
    ],
  };
  const expected = `CREATE TABLE User (
  id INT,
  name VARCHAR(255)
);

`;
  const result = writer.generateCode(diagram);
  expect(result).toEqual(expected);
});

test("should generate SQL for multiple tables", () => {
  const diagram: SQLDiagram = {
    tables: [
      {
        name: "User",
        columns: [
          { name: "id", type: "INT" },
          { name: "name", type: "VARCHAR(255)" },
        ],
      },
      {
        name: "Post",
        columns: [
          { name: "postId", type: "INT" },
          { name: "content", type: "VARCHAR(255)" },
          { name: "userId", type: "INT" },
        ],
      },
    ],
  };
  const expected = `CREATE TABLE User (
  id INT,
  name VARCHAR(255)
);

CREATE TABLE Post (
  postId INT,
  content VARCHAR(255),
  userId INT
);

`;
  const result = writer.generateCode(diagram);
  expect(result).toEqual(expected);
});

test("should handle tables with different data types", () => {
  const diagram: SQLDiagram = {
    tables: [
      {
        name: "Product",
        columns: [
          { name: "productId", type: "INT" },
          { name: "productName", type: "VARCHAR(255)" },
          { name: "price", type: "DECIMAL(10, 2)" },
        ],
      },
    ],
  };
  const expected = `CREATE TABLE Product (
  productId INT,
  productName VARCHAR(255),
  price DECIMAL(10, 2)
);

`;
  const result = writer.generateCode(diagram);
  expect(result).toEqual(expected);
});

test("should handle empty tables", () => {
  const diagram: SQLDiagram = {
    tables: [
      {
        name: "Empty",
        columns: [],
      },
    ],
  };
  const expected = `CREATE TABLE Empty (

);

`;
  const result = writer.generateCode(diagram);
  expect(result).toEqual(expected);
});