/**
 * Data model interfaces for the SQL diagram.
 * Corresponds to the contents of "sql-model.ts".
 */
// This was originally in a separate file, but included here for a self-contained example.
// import { DomainSpecificModel } from "../../data-model-api/domain-specific-model";

// Assuming DomainSpecificModel is a base interface. If not available, it can be a simple empty interface.
export interface DomainSpecificModel {}


export interface SQLDiagram extends DomainSpecificModel {
  tables: SQLTable[];
}

export interface SQLTable {
    name: string;
    columns: SQLColumn[];
    constraints?: SQLConstraint[];
}
 
export interface SQLColumn {
    name: string;
    type: SQLDataType;
    isNullable?: boolean;
    defaultValue?: string | number | boolean | null;
}

export interface SQLConstraint {
  type: 'PRIMARY KEY' | 'FOREIGN KEY' | 'UNIQUE';
  name?: string;
  columns: string[];
  references?: {
    table: string;
    columns: string[];
  }
}

export interface SQLDataType {
  name: string;
  parameters?: (string | number)[];
}


/**
 * The SQL Parser implementation.
 * Corresponds to the contents of "sql-parser.tsx".
 */
export interface SQLParser {
  parse(input: string): SQLDiagram;
}

class SimpleSQLParser implements SQLParser {
  private readonly validBaseDataTypes = new Set([
    "INT", "INTEGER", "TINYINT", "SMALLINT", "MEDIUMINT", "BIGINT", "UNSIGNED BIG INT", "INT2", "INT8",
    "CHARACTER", "VARCHAR", "VARYING CHARACTER", "NCHAR", "NATIVE CHARACTER", "NVARCHAR", "TEXT", "CLOB",
    "BLOB", "REAL", "DOUBLE", "DOUBLE PRECISION", "FLOAT", "NUMERIC", "DECIMAL", "BOOLEAN", "DATE", "DATETIME",
    "TIMESTAMP", "TIME", "YEAR"
  ]);

  parse(input: string): SQLDiagram {
    const diagram: SQLDiagram = { tables: [] };
    
    // This regex splits the input into individual CREATE TABLE statements.
    const statements = input.split(/(?=CREATE\s+TABLE)/i);

    statements.forEach((statement) => {
      if (statement.trim() === "") return;

      // Check for a valid table name
      const tableNameMatch = statement.match(/CREATE\s+TABLE\s+`?(\w+)`?/i);
      if (!tableNameMatch) {
        console.warn(`Skipping malformed statement starting near: "${statement.slice(0, 30)}..."`);
        return; // This statement is invalid, so skip to the next one
      }
      const tableName = tableNameMatch[1];
      
      // Check for the start and end of the column definitions
      const contentMatch = statement.match(/\(([\s\S]*)\)/);
      if (!contentMatch) {
          console.warn(`Could not find column definitions for table "${tableName}". Skipping.`);
          return;
      }

      const table: SQLTable = { name: tableName, columns: [] };
      const content = contentMatch[1]; // The part between the parentheses

      // Split content into individual column lines, safer than splitting by newline
      const columnAndConstraintLines = content.split(/,(?![^()]*\))/g);

      columnAndConstraintLines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine) {
          // Check if it's a column definition or a table constraint
          if (trimmedLine.toUpperCase().startsWith("CONSTRAINT") ||
              trimmedLine.toUpperCase().startsWith("PRIMARY KEY") ||
              trimmedLine.toUpperCase().startsWith("FOREIGN KEY") ||
              trimmedLine.toUpperCase().startsWith("UNIQUE")) {
            this.parseTableConstraint(trimmedLine, table);
          } else {
            this.parseColumn(trimmedLine, table);
          }
        }
      });
      
      diagram.tables.push(table);
    });

    return diagram;
  }

  /**
   * Helper method to parse a single column line and add it to the table.
   */
  private parseColumn(line: string, table: SQLTable): void {
    const trimmedLine = line.trim();
    // Regex to capture column name, data type, and the rest of the line for constraints.
    const columnMatch = trimmedLine.match(/^`?(\w+)`?\s+((?:[A-Z]+\s*)+?(?:\([^)]*\))?)(.*)?$/i);

    if (!columnMatch) {
        // Skip lines that don't look like a column definition (e.g., table-level constraints without keywords)
        console.warn(`SQL syntax warning in table "${table.name}": Could not parse line as column: "${line}"`);
        return;
    }

    const name = columnMatch[1];
    const fullTypeString = columnMatch[2].trim();
    const remainingLine = columnMatch[3] ? columnMatch[3].trim() : '';

    const baseTypeMatch = fullTypeString.match(/^([A-Z]+\s*)+/i);
    const baseType = baseTypeMatch ? baseTypeMatch[0].trim().toUpperCase() : '';

    if (!this.validBaseDataTypes.has(baseType)) {
        console.warn(`SQL syntax warning in table "${table.name}": Invalid data type "${baseType}" for column "${name}".`);
        return;
    }
    
    let type = this.mapStringToSqlDataType(fullTypeString);
    let isNullable: boolean | undefined = undefined;
    // FIX: Added 'boolean' to the type to allow for true/false default values.
    let defaultValue: string | number | boolean | null | undefined = undefined;

    if (remainingLine.toUpperCase().includes("NOT NULL")) {
      isNullable = false;
    } else if (remainingLine.toUpperCase().includes("NULL")) {
      isNullable = true;
    }

    const defaultMatch = remainingLine.match(/DEFAULT\s+((?:'.*?')|(?:"[^"]*")|(?:\d+(?:\.\d+)?)|(?:NULL)|(?:TRUE)|(?:FALSE)|(?:CURRENT_TIMESTAMP))/i);
    if (defaultMatch) {
        const value = defaultMatch[1];
        if (value.toUpperCase() === 'NULL') {
            defaultValue = null;
        } else if (value.toUpperCase() === 'TRUE') {
            defaultValue = true;
        } else if (value.toUpperCase() === 'FALSE') {
            defaultValue = false;
        } else if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
            defaultValue = value.slice(1, -1);
        } else if (!isNaN(Number(value))) {
            defaultValue = Number(value);
        } else {
            defaultValue = value;
        }
    }

    table.columns.push({ name, type, isNullable, defaultValue });
  }

  /**
   * Maps a data type string to the structured SQLDataType.
   */
  private mapStringToSqlDataType(typeStr: string): SQLDataType {
    // This regex handles multi-word types like "UNSIGNED BIG INT"
    const match = typeStr.match(/^((?:[A-Z]+\s*)+)(?:\((.*)\))?$/i);
    if (match) {
        const name = match[1].trim().toUpperCase();
        const paramsStr = match[2];

        const parameters = paramsStr 
            ? paramsStr.split(',').map(p => {
                const num = Number(p.trim());
                return isNaN(num) ? p.trim() : num;
              }) 
            : undefined;

        return { name, parameters };
    }
    return { name: typeStr.toUpperCase() };
  }

  /**
   * Helper method to parse a table-level constraint and add it to the table.
   */
  private parseTableConstraint(line: string, table: SQLTable): void {
    const trimmedLine = line.trim();

    // FOREIGN KEY constraint
    const foreignKeyMatch = trimmedLine.match(
      /(?:CONSTRAINT\s+`?(\w+)`?\s+)?FOREIGN\s+KEY\s*\(([^)]+)\)\s+REFERENCES\s+`?(\w+)`?\s*(?:\(([^)]+)\))?/i
    );
    if (foreignKeyMatch) {
      const constraintName = foreignKeyMatch[1];
      const columns = foreignKeyMatch[2].replace(/`/g, '').split(',').map(col => col.trim());
      const referencedTable = foreignKeyMatch[3];
      const referencedColumns = foreignKeyMatch[4] ? foreignKeyMatch[4].replace(/`/g, '').split(',').map(col => col.trim()) : columns;

      if (!table.constraints) {
        table.constraints = [];
      }
      table.constraints.push({
        type: 'FOREIGN KEY',
        name: constraintName,
        columns: columns,
        references: {
          table: referencedTable,
          columns: referencedColumns,
        },
      });
      return;
    }

    // PRIMARY KEY constraint (table level)
    const primaryKeyMatch = trimmedLine.match(
      /(?:CONSTRAINT\s+`?(\w+)`?\s+)?PRIMARY\s+KEY\s*\(([^)]+)\)/i
    );
    if (primaryKeyMatch) {
      const constraintName = primaryKeyMatch[1];
      const columns = primaryKeyMatch[2].replace(/`/g, '').split(',').map(col => col.trim());
      if (!table.constraints) {
        table.constraints = [];
      }
      table.constraints.push({
        type: 'PRIMARY KEY',
        name: constraintName,
        columns: columns,
      });
      return;
    }

    // UNIQUE constraint (table level)
    const uniqueKeyMatch = trimmedLine.match(
      /(?:CONSTRAINT\s+`?(\w+)`?\s+)?UNIQUE\s*\(([^)]+)\)/i
    );
    if (uniqueKeyMatch) {
      const constraintName = uniqueKeyMatch[1];
      const columns = uniqueKeyMatch[2].replace(/`/g, '').split(',').map(col => col.trim());
      if (!table.constraints) {
        table.constraints = [];
      }
      table.constraints.push({
        type: 'UNIQUE',
        name: constraintName,
        columns: columns,
      });
      return;
    }

    console.warn(`SQL syntax warning in table "${table.name}": Unrecognized table constraint: "${line}"`);
  }
}

export default SimpleSQLParser;
