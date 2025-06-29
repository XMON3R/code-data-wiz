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
          { name: "id", type: { name: "INT" } },
          { name: "name", type: { name: "VARCHAR", parameters: [255] } },
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

test("should handle tables with different data types and parameters", () => {
  const diagram: SQLDiagram = {
    tables: [
      {
        name: "Product",
        columns: [
          { name: "productId", type: { name: "INT" } },
          { name: "productName", type: { name: "VARCHAR", parameters: [100] } },
          { name: "price", type: { name: "DECIMAL", parameters: [10, 2] } },
          { name: "description", type: { name: "TEXT" } },
        ],
      },
    ],
  };
  const expected = `CREATE TABLE Product (
  productId INT,
  productName VARCHAR(100),
  price DECIMAL(10, 2),
  description TEXT
);

`;
  const result = writer.generateCode(diagram);
  expect(result).toEqual(expected);
});

test("should handle tables with no columns", () => {
  const diagram: SQLDiagram = {
    tables: [
      {
        name: "EmptyTable",
        columns: [],
      },
    ],
  };
  const expected = `CREATE TABLE EmptyTable (

);

`;
  const result = writer.generateCode(diagram);
  expect(result).toEqual(expected);
});

test("should handle an empty diagram with no tables", () => {
    const diagram: SQLDiagram = { tables: [] };
    const expected = "";
    const result = writer.generateCode(diagram);
    expect(result).toEqual(expected);
});