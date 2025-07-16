import { SQLDiagram, SQLTable, SQLColumn, SQLConstraint, SQLDataType } from "./sql-model";

/**
 * Defines the interface for a SQL parser.
 */
export interface SQLParser {
 parse(input: string): SQLDiagram;
}

/**
 * A simple implementation of a SQL parser for `CREATE TABLE` statements.
 */
class SimpleSQLParser implements SQLParser {
 private readonly validBaseDataTypes = new Set([
  "INT", "INTEGER", "TINYINT", "SMALLINT", "MEDIUMINT", "BIGINT", "UNSIGNED BIG INT", "INT2", "INT8",
  "CHARACTER", "VARCHAR", "VARYING CHARACTER", "NCHAR", "NATIVE CHARACTER", "NVARCHAR", "TEXT", "CLOB",
  "BLOB", "REAL", "DOUBLE", "DOUBLE PRECISION", "FLOAT", "NUMERIC", "DECIMAL", "BOOLEAN", "DATE", "DATETIME",
  "TIMESTAMP", "TIME", "YEAR"
 ]);

 parse(input: string): SQLDiagram {
  const diagram: SQLDiagram = { tables: [] };
  const statements = input.split(/(?=CREATE\s+TABLE)/i);

  statements.forEach((statement) => {
   if (statement.trim() === "") return;

   const tableNameMatch = statement.match(/CREATE\s+TABLE\s+`?(\w+)`?/i);
   if (!tableNameMatch) {
    console.warn(`Skipping malformed statement: "${statement.slice(0, 30)}..."`);
    return;
   }
   const tableName = tableNameMatch[1];

   const contentMatch = statement.match(/\(([\s\S]*)\)/);
   if (!contentMatch) {
    console.warn(`Could not find column definitions for table "${tableName}".`);
    return;
   }

   const table: SQLTable = { name: tableName, columns: [] };
   const content = contentMatch[1];
   const columnAndConstraintLines = content.split(/,(?![^()]*\))/g);

   columnAndConstraintLines.forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine) {
     if (/^(CONSTRAINT|PRIMARY\s+KEY|FOREIGN\s+KEY|UNIQUE)/i.test(trimmedLine)) {
      this.parseTableConstraint(trimmedLine, table);
     } else {
      this.parseColumn(trimmedLine, table);
     }
    }
   });

   if (table.columns.length > 0 || table.constraints) {
    diagram.tables.push(table);
   } else if (content.trim() === '') { // Handle empty tables like `CREATE TABLE Logs ();`
        diagram.tables.push(table);
      }
  });

  return diagram;
 }

 private parseColumn(line: string, table: SQLTable): void {
  const trimmedLine = line.trim();
  const columnMatch = trimmedLine.match(/^`?(\w+)`?\s+((?:[A-Z]+\s*)+?(?:\([^)]*\))?)(.*)?$/i);

  if (!columnMatch) {
   console.warn(`Could not parse line as column in table "${table.name}": "${line}"`);
   return;
  }

  const name = columnMatch[1];
  const fullTypeString = columnMatch[2].trim();
  const remainingLine = columnMatch[3] ? columnMatch[3].trim() : '';
  const baseType = (fullTypeString.match(/^([A-Z]+\s*)+/i) || [''])[0].trim().toUpperCase();

  if (!this.validBaseDataTypes.has(baseType)) {
   console.warn(`Invalid data type "${baseType}" for column "${name}" in table "${table.name}".`);
   return;
  }

  const column: SQLColumn = {
   name,
   type: this.mapStringToSqlDataType(fullTypeString),
  };

  if (remainingLine.toUpperCase().includes("NOT NULL")) {
   column.isNullable = false;
  } else if (remainingLine.toUpperCase().includes("NULL")) {
   column.isNullable = true;
  }

  const defaultMatch = remainingLine.match(/DEFAULT\s+((?:'.*?')|(?:"[^"]*")|(?:\d+(?:\.\d+)?)|(?:NULL)|(?:TRUE)|(?:FALSE)|(?:CURRENT_TIMESTAMP))/i);
  if (defaultMatch) {
   const value = defaultMatch[1];
   if (value.toUpperCase() === 'NULL') {
    column.defaultValue = null;
   } else if (value.toUpperCase() === 'TRUE') {
    column.defaultValue = true;
   } else if (value.toUpperCase() === 'FALSE') {
    column.defaultValue = false;
   } else if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
    column.defaultValue = value.slice(1, -1);
   } else if (!isNaN(Number(value))) {
    column.defaultValue = Number(value);
   } else {
    column.defaultValue = value;
   }
  }

    // This logic handles inline constraints like PRIMARY KEY or UNIQUE
    if (remainingLine.toUpperCase().includes("PRIMARY KEY")) {
        if (!table.constraints) table.constraints = [];
        table.constraints.push({ type: 'PRIMARY KEY', columns: [name] });
    }
    if (remainingLine.toUpperCase().includes("UNIQUE")) {
        if (!table.constraints) table.constraints = [];
        table.constraints.push({ type: 'UNIQUE', columns: [name] });
    }

  table.columns.push(column);
 }

 private mapStringToSqlDataType(typeStr: string): SQLDataType {
  const match = typeStr.match(/^((?:[A-Z]+\s*)+)(?:\((.*)\))?$/i);
  if (match) {
   const name = match[1].trim().toUpperCase();
   const paramsStr = match[2];
   const dataType: SQLDataType = { name };

   if (paramsStr) {
    dataType.parameters = paramsStr.split(',').map(p => {
     const num = Number(p.trim());
     return isNaN(num) ? p.trim() : num;
    });
   }
   return dataType;
  }
  return { name: typeStr.toUpperCase() };
 }

 private parseTableConstraint(line: string, table: SQLTable): void {
  const trimmedLine = line.trim();

  const foreignKeyMatch = trimmedLine.match(
   /(?:CONSTRAINT\s+`?(\w+)`?\s+)?FOREIGN\s+KEY\s*\(([^)]+)\)\s+REFERENCES\s+`?(\w+)`?\s*(?:\(([^)]+)\))?/i
  );
  if (foreignKeyMatch) {
   const constraintName = foreignKeyMatch[1];
   const columns = foreignKeyMatch[2].replace(/`/g, '').split(',').map(col => col.trim());
   const referencedTable = foreignKeyMatch[3];
   const referencedColumns = foreignKeyMatch[4] ? foreignKeyMatch[4].replace(/`/g, '').split(',').map(col => col.trim()) : columns;

   if (!table.constraints) table.constraints = [];
      const constraint: SQLConstraint = {
        type: 'FOREIGN KEY',
        columns,
        references: { table: referencedTable, columns: referencedColumns },
      };
      if (constraintName) constraint.name = constraintName;
   table.constraints.push(constraint);
   return;
  }

  const primaryKeyMatch = trimmedLine.match(/(?:CONSTRAINT\s+`?(\w+)`?\s+)?PRIMARY\s+KEY\s*\(([^)]+)\)/i);
  if (primaryKeyMatch) {
   const constraintName = primaryKeyMatch[1];
   const columns = primaryKeyMatch[2].replace(/`/g, '').split(',').map(col => col.trim());
   if (!table.constraints) table.constraints = [];
      const constraint: SQLConstraint = { type: 'PRIMARY KEY', columns };
      if (constraintName) constraint.name = constraintName;
   table.constraints.push(constraint);
   return;
  }

  const uniqueKeyMatch = trimmedLine.match(/(?:CONSTRAINT\s+`?(\w+)`?\s+)?UNIQUE\s*\(([^)]+)\)/i);
  if (uniqueKeyMatch) {
   const constraintName = uniqueKeyMatch[1];
   const columns = uniqueKeyMatch[2].replace(/`/g, '').split(',').map(col => col.trim());
   if (!table.constraints) table.constraints = [];
      const constraint: SQLConstraint = { type: 'UNIQUE', columns };
      if (constraintName) constraint.name = constraintName;
   table.constraints.push(constraint);
   return;
  }

  console.warn(`Unrecognized table constraint in table "${table.name}": "${line}"`);
 }
}

export default SimpleSQLParser;
