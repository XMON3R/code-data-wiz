import { SQLDiagram, SQLColumn, SQLDataType, SQLTable } from "./sql-model";

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

    statements.forEach((statement, index) => {
      if (statement.trim() === "") return;

      // Check for a valid table name
      const tableNameMatch = statement.match(/CREATE\s+TABLE\s+(\w+)/i);
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
      const columnLines = content.split(/,(?![^()]*\))/g);

      columnLines.forEach(colLine => {
        const trimmedLine = colLine.trim();
        if (trimmedLine) {
          // The line number is not easily available in this context,
          // so we reference the table name in the error message.
          this.parseColumn(trimmedLine, table);
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
      const parts = line.trim().split(/\s+/);
      if (parts.length < 2 || parts[1] === "") {
          throw new Error(`SQL syntax error in table "${table.name}": Column definition "${line}" is incomplete.`);
      }
      const name = parts[0];
      const fullTypeString = parts.slice(1).join(' ');

      const baseType = fullTypeString.split('(')[0].toUpperCase();
      if (!this.validBaseDataTypes.has(baseType)) {
          throw new Error(`SQL syntax error in table "${table.name}": Invalid data type "${baseType}" for column "${name}".`);
      }
      
      const type = this.mapStringToSqlDataType(fullTypeString);
      table.columns.push({ name, type });
  }

  /**
   * Maps a data type string to the structured SQLDataType.
   */
  private mapStringToSqlDataType(typeStr: string): SQLDataType {
    const match = typeStr.match(/(\w+)(?:\((.*)\))?/);
    if (match) {
        const name = match[1].toUpperCase();
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
}

export default SimpleSQLParser;