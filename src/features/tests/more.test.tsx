import { describe, it, expect } from "vitest";
import Parser from "tree-sitter";
//import CSharp from "tree-sitter-c-sharp";
import Python from "tree-sitter-python";
//import SQL from "tree-sitter-sql";
import PHP from "tree-sitter-php";



/*
describe("Tree-Sitter Parsing", () => {
  it("parses C# code", async () => {
    const code = "class Hello { void World() { Console.WriteLine(\"Hello, world!\"); } }";
    const tree = await parseCode(code, CSharp);
    expect(tree.rootNode.type).toBe("compilation_unit");
  });


  it("parses Python code", async () => {
    const code = "def hello():\n  print('Hello, world!')";
    const tree = await parseCode(code, Python);
    expect(tree.rootNode.type).toBe("module");
  });

  
  it("parses SQL code", async () => {
    const code = "SELECT name FROM users WHERE id = 1;";
    const tree = await parseCode(code, SQL);
    expect(tree.rootNode.type).toBe("source_file");
  });
  
});*/

async function parseCode(code: string, language: any) {
    const parser = new Parser();
    parser.setLanguage(language);
    return parser.parse(code);
  }

describe("Tree-Sitter Parsing for Python", () => {
    it("parses Python code and logs AST", async () => {
      const code = `
  def hello():
      print("Hello, world!")
  `;
      const tree = await parseCode(code, Python);
  
      // Logujeme celý AST jako string
      console.log(tree.rootNode.toString());
  
      // Ověříme, že kořenový uzel je správně detekován jako 'module'
      expect(tree.rootNode.type).toBe("module");
    });
});


describe("Tree-Sitter Parsing for PHP", () => {
    it("parses PHP and logs AST", async () => {
      const code = `<?php echo "Hello, world!"; ?>`;
      const tree = await parseCode(code, PHP);
      
      console.log("PHP AST:\n", tree.rootNode.toString());
  
      // Ověříme, že kořenový uzel je 'program'
      expect(tree.rootNode.type).toBe("program");
    });
  });



  /* 
  
  (module
  (function_definition
    name: (identifier)
    parameters: (parameters)
    body: (block
      (expression_statement
        (call
          function: (identifier)
          arguments: (argument_list
            (string)))))

  
  */