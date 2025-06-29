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

    // Input data for testing: SQLDiagram -> UniversalModel
    // Uses the new structured SQLDataType
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

    // Expected output/Input data for testing: UniversalModel -> SQLDiagram
    // The domainSpecificType is a string representation of the SQL type
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
    // 'toEqual' performs a deep comparison of the objects
    expect(result).toEqual(mockUniversalModel);
  });

  // Test for the fromUniversalModel method
  it("should correctly convert UniversalModel to SQLDiagram", async () => {
    const result = await adapter.fromUniversalModel(mockUniversalModel);
    expect(result).toEqual(mockSqlDiagram);
  });

  // Test that verifies the entire cycle for data consistency
  it("should maintain data consistency after a full conversion cycle with logging", async () => {
    console.log("--- START: Full conversion cycle test ---");

    // Step 1: Convert from the specific SQL model to the universal model
    console.log("Step 1: Converting SQLDiagram -> UniversalModel");
    console.log("Input SQLDiagram:", JSON.stringify(mockSqlDiagram, null, 2));
    const universal = await adapter.toUniversalModel(mockSqlDiagram);
    console.log("Resulting UniversalModel:", JSON.stringify(universal, null, 2));
    
    // Check after the first step
    expect(universal).toEqual(mockUniversalModel);
    console.log("Step 1 check: OK");

    // Step 2: Convert from the universal model back to the specific SQL model
    console.log("\nStep 2: Converting UniversalModel -> SQLDiagram");
    const finalSql = await adapter.fromUniversalModel(universal);
    console.log("Resulting SQLDiagram:", JSON.stringify(finalSql, null, 2));

    // Final check
    expect(finalSql).toEqual(mockSqlDiagram);
    console.log("Step 2 check: OK");
    console.log("--- END: Test completed successfully ---");
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