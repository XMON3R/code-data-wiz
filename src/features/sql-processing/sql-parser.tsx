import ParserWriter from "../translation/parsers/parser-writer";

class SQLParserWriter implements ParserWriter {
    parse(input: string): string {
      const classRegex = /class (\w+)\s*\{([^}]*)\}/g;
      let diagram = '';
      let match;
  
      while ((match = classRegex.exec(input)) !== null) {
        const className = match[1];
        const attributes = match[2]
          .split('\n')
          .map((attr) => attr.trim())
          .filter((attr) => attr !== '');
  
        diagram += `class ${className} {\n`;
        attributes.forEach((attr) => {
          diagram += `  ${attr}\n`;
        });
        diagram += `}\n`;
      }
  
      return diagram;
    }
  
    generateCode(parsed: string): string {
      const classRegex = /class (\w+)\s*\{\n([^}]*)\n\}/g;
      let sqlStatements = '';
      let match;
  
      while ((match = classRegex.exec(parsed)) !== null) {
        const className = match[1];
        const attributes = match[2]
          .split('\n')
          .map((attr) => attr.trim())
          .filter((attr) => attr !== '');
  
        sqlStatements += `CREATE TABLE ${className} (\n`;
  
        attributes.forEach((attr) => {
          const [type, name] = attr.split(' ');
          const sqlType = this.mapTypeToSQL(type);
          sqlStatements += `  ${name} ${sqlType},\n`;
        });
  
        sqlStatements = sqlStatements.trimEnd().slice(0, -1); // Remove trailing comma
        sqlStatements += '\n);\n\n';
      }
  
      return sqlStatements;
    }
  
    private mapTypeToSQL(type: string): string {
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
  
  export default SQLParserWriter;
  