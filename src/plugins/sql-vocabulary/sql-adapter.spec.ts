import { describe, it, expect, beforeEach } from "vitest";
import { SqlAdapter } from "./sql-adapter";
import { SQLDiagram } from "./sql-model";
import { UniversalModel } from "../../data-model-api/universal-model";

// Describe block to group all tests for the SqlAdapter
describe("SqlAdapter", () => {
 let adapter: SqlAdapter;
 let mockSqlDiagram: SQLDiagram;
 let mockUniversalModel: UniversalModel;

 // This runs before each test, ensuring fresh data for every test case
 beforeEach(() => {
  adapter = new SqlAdapter();

  mockSqlDiagram = {
   tables: [
    {
     name: "Users",
     columns: [
      { name: "id", type: { name: "INT" } },
      { name: "email", type: { name: "VARCHAR", parameters: [255] } },
     ],
    },
    {
     name: "Products",
     columns: [{ name: "productId", type: { name: "INT" } }],
    },
   ],
  };

  mockUniversalModel = {
   entities: [
    {
     label: "Users",
     properties: [
      { label: "id", type: { domainSpecificType: "INT" } },
      { label: "email", type: { domainSpecificType: "VARCHAR(255)" } },
     ],
    },
    {
     label: "Products",
     properties: [
      { label: "productId", type: { domainSpecificType: "INT" } },
     ],
    },
   ],
  };
 });

 // Test for the toUniversalModel method
 it("should correctly convert SQLDiagram to UniversalModel", async () => {
  const result = await adapter.toUniversalModel(mockSqlDiagram);
  expect(result).toEqual(mockUniversalModel);
 });

 // Test for the fromUniversalModel method
 it("should correctly convert UniversalModel to SQLDiagram", async () => {
  const result = await adapter.fromUniversalModel(mockUniversalModel);
  expect(result).toEqual(mockSqlDiagram);
 });

 // Test for toUniversalModel with nullable and default values
 it("should correctly convert SQLDiagram with nullable and default values to UniversalModel", async () => {
  const sqlDiagramWithDefaults: SQLDiagram = {
   tables: [{
     name: "Settings",
     columns: [
      { name: "id", type: { name: "INT" } },
      { name: "theme", type: { name: "VARCHAR", parameters: [20] }, defaultValue: "dark" },
      { name: "notifications_enabled", type: { name: "BOOLEAN" }, defaultValue: true },
      { name: "retry_count", type: { name: "INT" }, defaultValue: 0 },
      { name: "last_login", type: { name: "TIMESTAMP" }, defaultValue: null, isNullable: true },
      { name: "is_active", type: { name: "BOOLEAN" }, isNullable: false },
     ],
    }],
  };

  const expectedUniversalModel: UniversalModel = {
   entities: [{
     label: "Settings",
     properties: [
      { label: "id", type: { domainSpecificType: "INT" } },
      { label: "theme", type: { domainSpecificType: "VARCHAR(20)" }, value: { defaultValue: "dark" } },
      { label: "notifications_enabled", type: { domainSpecificType: "BOOLEAN" }, value: { defaultValue: true } },
      { label: "retry_count", type: { domainSpecificType: "INT" }, value: { defaultValue: 0 } },
      { label: "last_login", type: { domainSpecificType: "TIMESTAMP" }, value: { defaultValue: null, isNullable: true } },
      { label: "is_active", type: { domainSpecificType: "BOOLEAN" }, value: { isNullable: false } },
     ],
    }],
  };

  const result = await adapter.toUniversalModel(sqlDiagramWithDefaults);
  expect(result).toEqual(expectedUniversalModel);
 });

 // Test for fromUniversalModel with nullable and default values
 it("should correctly convert UniversalModel with nullable and default values to SQLDiagram", async () => {
  const universalModelWithDefaults: UniversalModel = {
   entities: [{
     label: "Settings",
     properties: [
      { label: "id", type: { domainSpecificType: "INT" } },
      { label: "theme", type: { domainSpecificType: "VARCHAR(20)" }, value: { defaultValue: "dark" } },
      { label: "notifications_enabled", type: { domainSpecificType: "BOOLEAN" }, value: { defaultValue: true } },
      { label: "retry_count", type: { domainSpecificType: "INT" }, value: { defaultValue: 0 } },
      { label: "last_login", type: { domainSpecificType: "TIMESTAMP" }, value: { defaultValue: null, isNullable: true } },
      { label: "is_active", type: { domainSpecificType: "BOOLEAN" }, value: { isNullable: false } },
     ],
    }],
  };

  const expectedSqlDiagram: SQLDiagram = {
   tables: [{
     name: "Settings",
     columns: [
      { name: "id", type: { name: "INT" } },
      { name: "theme", type: { name: "VARCHAR", parameters: [20] }, defaultValue: "dark" },
      { name: "notifications_enabled", type: { name: "BOOLEAN" }, defaultValue: true },
      { name: "retry_count", type: { name: "INT" }, defaultValue: 0 },
      { name: "last_login", type: { name: "TIMESTAMP" }, defaultValue: null, isNullable: true },
      { name: "is_active", type: { name: "BOOLEAN" }, isNullable: false },
     ],
    }],
  };

  const result = await adapter.fromUniversalModel(universalModelWithDefaults);
  expect(result).toEqual(expectedSqlDiagram);
 });

 // Test for handling constraints
 it("should correctly convert SQLDiagram with constraints to UniversalModel and back", async () => {
  const sqlDiagramWithConstraints: SQLDiagram = {
   tables: [{
    name: "Orders",
    columns: [
     { name: "order_id", type: { name: "INT" } },
     { name: "customer_id", type: { name: "INT" } },
     { name: "order_number", type: { name: "VARCHAR", parameters: [20] } },
    ],
    constraints: [
     { type: 'PRIMARY KEY', columns: ['order_id'] },
     { type: 'UNIQUE', name: 'UQ_OrderNumber', columns: ['order_number'] },
     { type: 'FOREIGN KEY', name: 'FK_CustomerOrder', columns: ['customer_id'], references: { table: 'Customers', columns: ['id'] } }
    ]
   }],
  };

  const expectedUniversalModel: UniversalModel = {
   entities: [{
    label: "Orders",
    properties: [
     { label: "order_id", type: { domainSpecificType: "INT" } },
     { label: "customer_id", type: { domainSpecificType: "INT" } },
     { label: "order_number", type: { domainSpecificType: "VARCHAR(20)" } },
    ],
    value: {
     constraints: [
      { type: 'PRIMARY KEY', columns: ['order_id'] },
      { type: 'UNIQUE', name: 'UQ_OrderNumber', columns: ['order_number'] },
      { type: 'FOREIGN KEY', name: 'FK_CustomerOrder', columns: ['customer_id'], references: { table: 'Customers', columns: ['id'] } }
     ]
    }
   }]
  };

  // Test toUniversalModel
  const universalResult = await adapter.toUniversalModel(sqlDiagramWithConstraints);
  expect(universalResult).toEqual(expectedUniversalModel);

  // Test fromUniversalModel
  const sqlResult = await adapter.fromUniversalModel(universalResult);
  expect(sqlResult).toEqual(sqlDiagramWithConstraints);
 });

 // Test that verifies the entire cycle for data consistency
 it("should maintain data consistency after a full conversion cycle", async () => {
  const universal = await adapter.toUniversalModel(mockSqlDiagram);
  const finalSql = await adapter.fromUniversalModel(universal);
  expect(finalSql).toEqual(mockSqlDiagram);
 });

 // Test for handling an empty input
 it("should handle an empty SQLDiagram", async () => {
  const emptyDiagram: SQLDiagram = { tables: [] };
  const expectedModel: UniversalModel = { entities: [] };
  const result = await adapter.toUniversalModel(emptyDiagram);
  expect(result).toEqual(expectedModel);
 });

 // Test for handling an empty UniversalModel
 it("should handle an empty UniversalModel", async () => {
  const emptyModel: UniversalModel = { entities: [] };
  const expectedDiagram: SQLDiagram = { tables: [] };
  const result = await adapter.fromUniversalModel(emptyModel);
  expect(result).toEqual(expectedDiagram);
 });
});
