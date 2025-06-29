// src/plugins/sql-vocabulary/sql-writer.tsx
import { SQLDiagram, SQLDataType } from "./sql-model";

export interface SQLWriter {
  generateCode(parsed: SQLDiagram): string;
}

export class SimpleSQLWriter implements SQLWriter {
  generateCode(parsed: SQLDiagram): string {
    let sqlStatements = "";

    for (const table of parsed.tables) {
      sqlStatements += `CREATE TABLE ${table.name} (\n`;
      const columnDefinitions = table.columns
        .map(column => `  ${column.name} ${this.formatDataType(column.type)}`)
        .join(",\n");
      sqlStatements += `${columnDefinitions}\n);\n\n`;
    }

    return sqlStatements;
  }

  /**
   * Formats the SQLDataType object back into a string representation.
   * e.g., { name: 'VARCHAR', parameters: [255] } -> "VARCHAR(255)"
   */
  private formatDataType(type: SQLDataType): string {
    let formattedType = type.name;
    if (type.parameters && type.parameters.length > 0) {
      formattedType += `(${type.parameters.join(", ")})`;
    }
    return formattedType;
  }
}