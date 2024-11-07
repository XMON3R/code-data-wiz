import { useState, useRef, useCallback } from "react";
import ClassParser from '../utils/ClassParser.tsx'; // Adjust the import path as needed

const useAppLogic = () => {
  const [textLeft, setTextLeft] = useState("");  // holds the original class diagram text
  const [textRight, setTextRight] = useState("");  // holds the translated class diagram
  const [parsedDiagram, setParsedDiagram] = useState("");  // holds the parsed class diagram
  const [sqlTranslation, setSqlTranslation] = useState("");  // holds the generated SQL

  const typingTimerRef = useRef<number | null>(null);  // ref to manage typing timeout

  // parses the input class diagram text and generates SQL
  const translateText = useCallback((text: string) => {
    const diagram = ClassParser.parseClasses(text);  // parses class definitions from text
    setParsedDiagram(diagram);  // stores the parsed class diagram
    setTextRight(diagram);  // updates the translated class diagram

    const sql = ClassParser.generateSQLFromClassDiagram(diagram);  // generates SQL from the parsed diagram
    setSqlTranslation(sql);  // stores the generated SQL
  }, []);

  // handles changes to the input text (to be called via CodeMirror onChange)
  const handleChangeTextLeft = (value: string) => {
    setTextLeft(value);
    if (typingTimerRef.current !== null) {
      clearTimeout(typingTimerRef.current);
    }
    typingTimerRef.current = window.setTimeout(() => {
      translateText(value);
    }, 300);  // triggers translation after a delay to avoid excessive calls
  };

  return { textLeft, textRight, handleChangeTextLeft, parsedDiagram, sqlTranslation };
};

export default useAppLogic;