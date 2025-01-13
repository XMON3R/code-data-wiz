/*import { useState, useRef, useCallback } from 'react';
import ClassParser from '../utils/newclassParser'; // Adjust the import path as needed

const translationController = () => {
  const [textLeft, setTextLeft] = useState(''); // holds the original class diagram text
  const [textRight, setTextRight] = useState(''); // holds the translated class diagram
  const [parsedDiagram, setParsedDiagram] = useState(''); // holds the parsed class diagram
  const [sqlTranslation, setSqlTranslation] = useState(''); // holds the generated SQL

  const typingTimerRef = useRef<number | null>(null); // ref to manage typing timeout

  // parses the input class diagram text and generates SQL
  const translateText = useCallback((text: string) => {
    const diagram = ClassParser.parseClasses(text); // parses class definitions from text
    setParsedDiagram(diagram); // stores the parsed class diagram
    setTextRight(diagram); // updates the translated class diagram

    const sql = ClassParser.generateSQLFromClassDiagram(diagram); // generates SQL from the parsed diagram
    setSqlTranslation(sql); // stores the generated SQL
  }, []);

  // handles changes to the input text (to be called via CodeMirror onChange)
  const handleChangeTextLeft = (value: string) => {
    setTextLeft(value);
    if (typingTimerRef.current !== null) {
      clearTimeout(typingTimerRef.current);
    }
    typingTimerRef.current = window.setTimeout(() => {
      translateText(value);
    }, 300); 
  };

  return {
    textLeft,
    textRight,
    handleChangeTextLeft,
    parsedDiagram,
    sqlTranslation,
  };
};

export default translationController;
*/



import { useState, useRef, useCallback } from 'react';
import ParserWriter from '../utils/parserWriter'; // Import the new interfaces
//import ClassParser from '../utils/classParser'; // Adjust the import path as needed
//import SQLWriter from '../utils/sqlParser'; // Import SQL writer or other writers

const translationController = (parserWriter: ParserWriter) => {
  const [textLeft, setTextLeft] = useState(''); // holds the original class diagram text
  const [textRight, setTextRight] = useState(''); // holds the translated class diagram
  const [parsedDiagram, setParsedDiagram] = useState(''); // holds the parsed class diagram
  const [generatedCode, setGeneratedCode] = useState(''); // holds the generated code (e.g., SQL)

  const typingTimerRef = useRef<number | null>(null); // ref to manage typing timeout

  // Parses the input and generates the output using the provided ParserWriter
  const translateText = useCallback(
    (text: string) => {
      const parsed = parserWriter.parse(text); // Parse the input text
      setParsedDiagram(parsed); // Store the parsed diagram
      setTextRight(parsed); // Update the translated diagram

      const generated = parserWriter.generateCode(parsed); // Generate code from the parsed diagram
      setGeneratedCode(generated); // Store the generated code
    },
    [parserWriter]
  );

  // Handles changes to the input text (to be called via CodeMirror onChange)
  const handleChangeTextLeft = (value: string) => {
    setTextLeft(value);
    if (typingTimerRef.current !== null) {
      clearTimeout(typingTimerRef.current);
    }
    typingTimerRef.current = window.setTimeout(() => {
      translateText(value);
    }, 300);
  };

  return {
    textLeft,
    textRight,
    handleChangeTextLeft,
    parsedDiagram,
    generatedCode,
  };
};

export default translationController;
