import ParserWriter from "./parserWriter";

class ClassParser {
    private parserWriter: ParserWriter;
  
    constructor(parserWriter: ParserWriter) {
      this.parserWriter = parserWriter;
    }
  
    parse(input: string): string {
      return this.parserWriter.parse(input);
    }
  
    generateCode(parsed: string): string {
      return this.parserWriter.generateCode(parsed);
    }
  }
  
  export default ClassParser;