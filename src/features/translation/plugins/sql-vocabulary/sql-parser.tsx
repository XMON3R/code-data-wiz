// sql-parser.ts
import { SQLDiagram, SQLTable, SQLColumn, SQLDataType } from './sql-model';

export interface SQLParser {
  parse(input: string): SQLDiagram;
}

class SimpleSQLParser implements SQLParser {
  parse(input: string): SQLDiagram {
    const classRegex = /class (\w+)\s*\{([^}]*)\}/g;
    const diagram: SQLDiagram = { tables: [] };
    let match;

    while ((match = classRegex.exec(input)) !== null) {
      const tableName = match[1];
      const attributesString = match[2];
      const attributes = attributesString
        .split('\n')
        .map((attr) => attr.trim())
        .filter((attr) => attr !== '');

      const columns: SQLColumn[] = attributes.map((attr) => {
        const [type, name] = attr.split(' ');
        return { name: name.trim(), type: this.mapTypeToSQL(type.trim()) };
      });

      diagram.tables.push({ name: tableName, columns });
    }

    return diagram;
  }

  private mapTypeToSQL(type: string): SQLDataType {
    switch (type) {
      case 'int':
        return 'INT';
      case 'String':
        return 'VARCHAR(255)';
      case 'double':
        return 'DECIMAL(10, 2)';
      default:
        return 'TEXT';
    }
  }
}

export default SimpleSQLParser;