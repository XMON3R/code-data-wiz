import { describe, it, expect, beforeEach } from "vitest";
import { SqlAdapter } from "./sql-adapter";
import { SQLDiagram } from "./sql-model";
import { UniversalModel, UniversalType } from "../../data-model-api/universal-model";

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
      { label: "id", type: { domainSpecificType: "INT", universalType: UniversalType.Number } },
      { label: "email", type: { domainSpecificType: "VARCHAR(255)", universalType: UniversalType.String } },
     ],
    },
    {
     label: "Products",
     properties: [
      { label: "productId", type: { domainSpecificType: "INT", universalType: UniversalType.Number},  },
     ],
    },
   ],relationships: []
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

 // Test for fromUniversalModel with nullable and default values
 it("should correctly convert UniversalModel with nullable and default values to SQLDiagram", async () => {
  const universalModelWithDefaults: UniversalModel = {
   entities: [{
     label: "Settings",
     properties: [
      { label: "id", type: { domainSpecificType: "INT", universalType: UniversalType.Number } },
      { label: "theme", type: { domainSpecificType: "VARCHAR(20)", universalType: UniversalType.String }, value: { defaultValue: "dark" } },
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

});