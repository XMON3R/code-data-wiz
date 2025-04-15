import ParserWriter from './parser-writer'

//general "to-do" class for any translation "module"
class ClassParser {
  //uses ParserWriter interface
  private parserWriter: ParserWriter;

  // Constructor for initialization
  constructor(parserWriter: ParserWriter) {
    this.parserWriter = parserWriter;
  }

  // Enforce parse method, processes input (background)
  parse(input: string): string {
    return this.parserWriter.parse(input);
  }

  // Enforce generateCode method, translates and shows to the user
  generateCode(parsed: string): string {
    return this.parserWriter.generateCode(parsed);
  }
}

export default ClassParser;
