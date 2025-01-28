import { useState, useRef, useCallback } from 'react';
//import ParserWriter from '../utils/parser-writer'; // Import the new interfaces

import ParserWriter from './parsers/parser-writer'; // Import the new interfaces

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
