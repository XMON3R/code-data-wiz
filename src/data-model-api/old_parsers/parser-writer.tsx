// Interface for implementing separate "modules" for translation
interface ParserWriter {
  // Parse input from any language
  parse(input: string): string;

  // Generate code from parsed string created by parse method
  generateCode(parsed: string): string;
}

export default ParserWriter;
