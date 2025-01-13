interface ParserWriter {
    parse(input: string): string;
    generateCode(parsed: string): string;
  }
  
export default ParserWriter;