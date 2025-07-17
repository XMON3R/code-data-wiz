import { SQLDiagram, SQLDataType } from "./sql-model";

/**
 * Interface for SQL code generators from SQL diagrams.
 */
export interface SQLWriter {
  /**
   * Generates SQL code from a parsed SQL diagram.
   * @param parsed The parsed SQLDiagram object.
   * @returns SQL string representing the schema.
   */
  generateCode(parsed: SQLDiagram): string;
}

/**
 * A simple SQL writer that converts SQLDiagram objects into SQL DDL statements.
 */
export class SimpleSQLWriter implements SQLWriter {
  generateCode(parsed: SQLDiagram): string {
    let sqlStatements = "";

    for (const table of parsed.tables) {
      sqlStatements += `CREATE TABLE ${table.name} (\n`;
      const columnDefinitions: string[] = [];

      // Generate column definitions
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

      // Generate table-level constraints
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
                continue; // Skip adding this constraint if references are not provided
              }
              break;
            default:
              console.warn(`Unknown constraint type: ${constraint.type}`);
              continue; // Skip unknown constraints
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
   * Formats a SQLDataType object to a string.
   * Example: { name: 'VARCHAR', parameters: [255] } => "VARCHAR(255)"
   * @param type The SQL data type object.
   */
  private formatDataType(type: SQLDataType): string {
    let formattedType = type.name;
    if (type.parameters && type.parameters.length > 0) {
      formattedType += `(${type.parameters.join(", ")})`;
    }
    return formattedType;
  }

  /**
   * Formats a default value into SQL syntax.
   * @param value The default value.
   */
  private formatDefaultValue(value: any): string {
    if (value === null) {
      return "NULL";
    } else if (typeof value === 'string') {
      // Escape single quotes and wrap in single quotes
      return `'${value.replace(/'/g, "''")}'`;
    } else if (typeof value === 'boolean') {
      return value ? 'TRUE' : 'FALSE';
    } else if (typeof value === 'number') {
      return String(value);
    } else if (value === 'CURRENT_TIMESTAMP') {
      return 'CURRENT_TIMESTAMP';
    }

    console.warn(`Unsupported default value type: ${typeof value}. Value: ${value}`);
    return String(value);
  }
}
