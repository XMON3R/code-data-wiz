import { describe, it, expect } from "vitest";
import SimpleSQLParser from "./sql-parser";
import { SQLDiagram } from "./sql-model";

describe("SimpleSQLParser with CREATE TABLE syntax", () => {
  const parser = new SimpleSQLParser();

  it("should parse a single CREATE TABLE statement", () => {
    const input = `CREATE TABLE Users (id INT, name VARCHAR(255));`;
    const expected: SQLDiagram = {
      tables: [{
        name: "Users",
        columns: [
          { name: "id", type: { name: "INT" } },
          { name: "name", type: { name: "VARCHAR", parameters: [255] } },
        ],
      }],
    };
    expect(parser.parse(input)).toEqual(expected);
  });

  it("should parse multiple CREATE TABLE statements", () => {
    const input = `CREATE TABLE Products (product_id INT); CREATE TABLE Orders (order_id INT, product_id INT);`;
    const expected: SQLDiagram = {
      tables: [
        { name: "Products", columns: [{ name: "product_id", type: { name: "INT" } }] },
        { name: "Orders", columns: [{ name: "order_id", type: { name: "INT" } }, { name: "product_id", type: { name: "INT" } }] },
      ],
    };
    expect(parser.parse(input)).toEqual(expected);
  });

  it("should handle different data types with parameters", () => {
    const input = `CREATE TABLE Inventory (item_id INT, price DECIMAL(10, 2), description TEXT);`;
    const expected: SQLDiagram = {
      tables: [{
        name: "Inventory",
        columns: [
          { name: "item_id", type: { name: "INT" } },
          { name: "price", type: { name: "DECIMAL", parameters: [10, 2] } },
          { name: "description", type: { name: "TEXT" } },
        ],
      }],
    };
    expect(parser.parse(input)).toEqual(expected);
  });

  it("should handle tables with no columns", () => {
    const input = `CREATE TABLE Logs ();`;
    const expected: SQLDiagram = { tables: [{ name: "Logs", columns: [] }] };
    expect(parser.parse(input)).toEqual(expected);
  });

  it("should return an empty diagram for an empty input string", () => {
    const input = "";
    const expected: SQLDiagram = { tables: [] };
    expect(parser.parse(input)).toEqual(expected);
  });

  it("should parse columns with NOT NULL and NULL constraints", () => {
    const input = `CREATE TABLE Users (id INT NOT NULL, username VARCHAR(50) NOT NULL, email VARCHAR(100) NULL);`;
    const expected: SQLDiagram = {
      tables: [{
        name: "Users",
        columns: [
          { name: "id", type: { name: "INT" }, isNullable: false },
          { name: "username", type: { name: "VARCHAR", parameters: [50] }, isNullable: false },
          { name: "email", type: { name: "VARCHAR", parameters: [100] }, isNullable: true },
        ],
      }],
    };
    expect(parser.parse(input)).toEqual(expected);
  });

  it("should parse columns with DEFAULT values", () => {
    const input = `CREATE TABLE Settings (id INT, theme VARCHAR(20) DEFAULT 'dark', n_enabled BOOLEAN DEFAULT TRUE, count INT DEFAULT 0, last_login TIMESTAMP DEFAULT NULL);`;
    const expected: SQLDiagram = {
      tables: [{
        name: "Settings",
        columns: [
          { name: "id", type: { name: "INT" } },
          { name: "theme", type: { name: "VARCHAR", parameters: [20] }, defaultValue: "dark" },
          { name: "n_enabled", type: { name: "BOOLEAN" }, defaultValue: true },
          { name: "count", type: { name: "INT" }, defaultValue: 0 },
          { name: "last_login", type: { name: "TIMESTAMP" }, defaultValue: null, isNullable: true },
        ],
      }],
    };
    expect(parser.parse(input)).toEqual(expected);
  });

  it("should parse table-level FOREIGN KEY constraint", () => {
    const input = `CREATE TABLE Orders (order_id INT, customer_id INT, CONSTRAINT FK_CustomerOrder FOREIGN KEY (customer_id) REFERENCES Customers(id));`;
    const expected: SQLDiagram = {
      tables: [{
        name: "Orders",
        columns: [{ name: "order_id", type: { name: "INT" } }, { name: "customer_id", type: { name: "INT" } }],
        constraints: [{
          type: "FOREIGN KEY",
          name: "FK_CustomerOrder",
          columns: ["customer_id"],
          references: { table: "Customers", columns: ["id"] },
        }],
      }],
    };
    expect(parser.parse(input)).toEqual(expected);
  });

  it("should parse table-level FOREIGN KEY constraint without explicit constraint name", () => {
    const input = `CREATE TABLE OrderItems (item_id INT, order_id INT, FOREIGN KEY (order_id) REFERENCES Orders(order_id));`;
    const expected: SQLDiagram = {
      tables: [{
        name: "OrderItems",
        columns: [{ name: "item_id", type: { name: "INT" } }, { name: "order_id", type: { name: "INT" } }],
        constraints: [{
          type: "FOREIGN KEY",
          columns: ["order_id"],
          references: { table: "Orders", columns: ["order_id"] },
        }],
      }],
    };
    expect(parser.parse(input)).toEqual(expected);
  });

  it("should parse table-level PRIMARY KEY constraint", () => {
    const input = `CREATE TABLE Employees (employee_id INT, first_name VARCHAR(50), PRIMARY KEY (employee_id));`;
    const expected: SQLDiagram = {
      tables: [{
        name: "Employees",
        columns: [
          { name: "employee_id", type: { name: "INT" } },
          { name: "first_name", type: { name: "VARCHAR", parameters: [50] } },
        ],
        constraints: [{ type: "PRIMARY KEY", columns: ["employee_id"] }],
      }],
    };
    expect(parser.parse(input)).toEqual(expected);
  });

  it("should parse table-level UNIQUE constraint", () => {
    const input = `CREATE TABLE Products (product_id INT, product_name VARCHAR(100), UNIQUE (product_name));`;
    const expected: SQLDiagram = {
      tables: [{
        name: "Products",
        columns: [
          { name: "product_id", type: { name: "INT" } },
          { name: "product_name", type: { name: "VARCHAR", parameters: [100] } },
        ],
        constraints: [{ type: "UNIQUE", columns: ["product_name"] }],
      }],
    };
    expect(parser.parse(input)).toEqual(expected);
  });

  it("should parse a combination of inline and table constraints", () => {
    const input = `
            CREATE TABLE Users (
                id INT NOT NULL PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                email VARCHAR(100) NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                manager_id INT,
                CONSTRAINT FK_Manager FOREIGN KEY (manager_id) REFERENCES Users(id)
            );
        `;
    const expected: SQLDiagram = {
      tables: [{
        name: "Users",
        columns: [
          { name: "id", type: { name: "INT" }, isNullable: false },
          { name: "username", type: { name: "VARCHAR", parameters: [50] }, isNullable: false },
          { name: "email", type: { name: "VARCHAR", parameters: [100] }, isNullable: true },
          { name: "created_at", type: { name: "TIMESTAMP" }, defaultValue: "CURRENT_TIMESTAMP" },
          { name: "manager_id", type: { name: "INT" } },
        ],
        constraints: [
                    { type: "PRIMARY KEY", columns: ["id"] },
                    { type: "UNIQUE", columns: ["username"] },
          { type: "FOREIGN KEY", name: "FK_Manager", columns: ["manager_id"], references: { table: "Users", columns: ["id"] } },
        ],
      }],
    };
    expect(parser.parse(input)).toEqual(expected);
  });
});
