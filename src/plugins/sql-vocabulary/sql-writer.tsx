// sql-writer.ts
import { SQLDiagram } from './sql-model';

export interface SQLWriter {
  generateCode(parsed: SQLDiagram): string;
}

export class SimpleSQLWriter implements SQLWriter {
  generateCode(parsed: SQLDiagram): string {
    let sqlStatements = '';

    for (const table of parsed.tables) {
      sqlStatements += `CREATE TABLE ${table.name} (\n`;
      const columnDefinitions = table.columns.map(column => `  ${column.name} ${column.type}`).join(',\n');
      sqlStatements += `${columnDefinitions}\n);\n\n`;
    }

    return sqlStatements;
  }
}