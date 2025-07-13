import { describe, it, expect } from "vitest";
import SimpleSQLParser from "./sql-parser";
import { SQLDiagram } from "./sql-model";

describe("SimpleSQLParser with CREATE TABLE syntax", () => {
    const parser = new SimpleSQLParser();

    it("should parse a single CREATE TABLE statement", () => {
        const input = `
            CREATE TABLE Users (
                id INT,
                name VARCHAR(255)
            );
        `;
        const expected: SQLDiagram = {
            tables: [
                {
                    name: "Users",
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

    it("should parse multiple CREATE TABLE statements", () => {
        const input = `
            CREATE TABLE Products (
                product_id INT
            );

            CREATE TABLE Orders (
                order_id INT,
                product_id INT
            );
        `;
        const expected: SQLDiagram = {
            tables: [
                {
                    name: "Products",
                    columns: [{ name: "product_id", type: { name: "INT" } }],
                },
                {
                    name: "Orders",
                    columns: [
                        { name: "order_id", type: { name: "INT" } },
                        { name: "product_id", type: { name: "INT" } },
                    ],
                },
            ],
        };
        const result = parser.parse(input);
        expect(result).toEqual(expected);
    });

    it("should handle different data types with parameters", () => {
        const input = `
            CREATE TABLE Inventory (
                item_id INT,
                price DECIMAL(10, 2),
                description TEXT
            );
        `;
        const expected: SQLDiagram = {
            tables: [
                {
                    name: "Inventory",
                    columns: [
                        { name: "item_id", type: { name: "INT" } },
                        { name: "price", type: { name: "DECIMAL", parameters: [10, 2] } },
                        { name: "description", type: { name: "TEXT" } },
                    ],
                },
            ],
        };
        const result = parser.parse(input);
        expect(result).toEqual(expected);
    });

    it("should handle tables with no columns", () => {
        const input = `CREATE TABLE Logs ();`;
        const expected: SQLDiagram = {
            tables: [{ name: "Logs", columns: [] }],
        };
        const result = parser.parse(input);
        expect(result).toEqual(expected);
    });

    it("should return an empty diagram for an empty input string", () => {
        const input = "";
        const expected: SQLDiagram = { tables: [] };
        const result = parser.parse(input);
        expect(result).toEqual(expected);
    });
});
