import { /*expect ,*/ test } from 'vitest';
//import { Parser } from 'node-sql-parser';
//import engine from 'php-parser';  // Import the PHP parser

import RefParser from '@apidevtools/json-schema-ref-parser';

//import antlr4 from 'antlr4';
//import CSharpLexer from '@antlr4-csharp/CSharpLexer';
//import CSharpParser from '@antlr4-csharp/CSharpParser';

// SQL Test, weird * and collumn behavior
// https://www.npmjs.com/package/node-sql-parser
test('SQL Parser should parse a basic SQL query', () => {
  const { Parser } = require('node-sql-parser');
  //const query = 'SELECT * FROM users';
  const parser = new Parser();
  const ast = parser.astify('SELECT Distinct column1 FROM whatever WHERE column1 = "yes"');

  console.log(ast);
});

//PHP Parser --- neodpovídá NPM tutorialu?
//https://www.npmjs.com/package/php-parser?activeTab=readme
test('PHP Parser', () => {
    const engine = require("php-parser");
    
    //initialize a new parser instance
    const parser = new engine({
        // some options :
        parser: {
        extractDoc: true,
        php7: true,
        },
        ast: {
        withPositions: true,
        },
    });

    // Retrieve the AST from the specified source
    const evaluation = parser.parseEval('echo "Hello World";');

    // Retrieve an array of tokens (same as php function token_get_all)
    const tokens = parser.tokenGetAll('<?php echo "Hello World";');

    // Log out results
    console.log("Eval parse:", evaluation);
    console.log("Tokens parse:", tokens);
});
 

test('JSON Schema Parser', async () => {
    const schema = {
        type: 'object',
        properties: {
            name: { type: 'string' },
            age: { type: 'integer' }
        },
        required: ['name']
    };

    // Parse the schema
    const parsedSchema = await RefParser.dereference(schema);

    // Log out results
    console.log('Original Schema:', schema);
    console.log('Parsed Schema:', parsedSchema);
});


//C# viz OpenChatGPT

/*
test('C# Parser', () => {
    const inputCode = 'Console.WriteLine("Hello World");';

    // Create an ANTLR input stream
    const inputStream = new antlr4.InputStream(inputCode);

    // Create a lexer for C#
    const lexer = new CSharpLexer(inputStream);
    const tokens = new antlr4.CommonTokenStream(lexer);

    // Create a parser for C#
    const parser = new CSharpParser(tokens);
    const tree = parser.compilation_unit(); // Start parsing from the root rule

    // Log results
    console.log('Tokens:', tokens.tokens.map(token => token.text));
    console.log('Parse Tree:', tree.toStringTree(parser.ruleNames));
});
*/

// https://www.npmjs.com/package/jsonschema


//https://www.antlr.org/