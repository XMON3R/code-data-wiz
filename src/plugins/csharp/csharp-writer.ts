import { CSharpDiagram, CSharpType } from "./csharp-model";

export interface CSharpWriter {
  generateCode(parsed: CSharpDiagram): string;
}

export class SimpleCSharpWriter implements CSharpWriter {
  generateCode(parsed: CSharpDiagram): string {
    let csharpCode = "";

    for (const csharpClass of parsed.classes) {
      csharpCode += `public class ${csharpClass.name}\n{\n`;
      const propertyDefinitions = csharpClass.properties
        .map(property => `    public ${this.formatCSharpType(property.type)} ${property.name} { get; set; }`)
        .join("\n");
      csharpCode += `${propertyDefinitions}\n}\n\n`;
    }

    return csharpCode;
  }

  private formatCSharpType(type: CSharpType): string {
    let formattedType = type.name;
    if (type.isNullable) {
      formattedType += "?";
    }
    return formattedType;
  }
}
