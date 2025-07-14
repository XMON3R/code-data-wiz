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
      const columnDefinitions: string[] = [];

      // Process columns
      for (const column of table.columns) {
        let columnDef = `  ${column.name} ${this.formatDataType(column.type)}`;
        if (column.isNullable === false) {
          columnDef += " NOT NULL";
        }
        if (column.defaultValue !== undefined) {
          columnDef += ` DEFAULT ${this.formatDefaultValue(column.defaultValue)}`;
        }
        columnDefinitions.push(columnDef);
      }

      // Process table-level constraints
      if (table.constraints && table.constraints.length > 0) {
        for (const constraint of table.constraints) {
          let constraintDef = `  `;
          if (constraint.name) {
            constraintDef += `CONSTRAINT ${constraint.name} `;
          }
          switch (constraint.type) {
            case 'PRIMARY KEY':
              constraintDef += `PRIMARY KEY (${constraint.columns.join(", ")})`;
              break;
            case 'UNIQUE':
              constraintDef += `UNIQUE (${constraint.columns.join(", ")})`;
              break;
            case 'FOREIGN KEY':
              if (constraint.references) {
                constraintDef += `FOREIGN KEY (${constraint.columns.join(", ")}) REFERENCES ${constraint.references.table} (${constraint.references.columns.join(", ")})`;
              } else {
                console.warn(`FOREIGN KEY constraint "${constraint.name || ''}" is missing references.`);
                // Optionally, decide how to handle this case: skip, throw error, etc.
                // For now, we'll just not add the constraint definition if references are missing.
                continue; // Skip adding this constraint definition
              }
              break;
            default:
              console.warn(`Unknown constraint type: ${constraint.type}`);
              continue; // Skip if unknown
          }
          columnDefinitions.push(constraintDef);
        }
      }

      sqlStatements += columnDefinitions.join(",\n");
      sqlStatements += "\n);\n\n";
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

  /**
   * Formats a default value for SQL.
   */
  private formatDefaultValue(value: any): string {
    if (value === null) {
      return "NULL";
    } else if (typeof value === 'string') {
      // Escape single quotes within the string and wrap in single quotes
      return `'${value.replace(/'/g, "''")}'`;
    } else if (typeof value === 'boolean') {
      return value ? 'TRUE' : 'FALSE';
    } else if (typeof value === 'number') {
      return String(value);
    } else if (value === 'CURRENT_TIMESTAMP') { // Handle specific keywords
      return 'CURRENT_TIMESTAMP';
    }
    // Fallback for other types, though ideally handled by specific cases
    console.warn(`Unsupported default value type: ${typeof value}. Value: ${value}`);
    return String(value);
  }
}
