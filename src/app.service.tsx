import { useState, useEffect, useRef, useCallback } from "react";

const useAppLogic = () => {
  const [textLeft, setTextLeft] = useState("");  //holds the original class diagram text
  const [textRight, setTextRight] = useState("");  //holds the translated class diagram
  const [parsedDiagram, setParsedDiagram] = useState("");  //holds the parsed class diagram
  const [sqlTranslation, setSqlTranslation] = useState("");  //holds the generated SQL

  const typingTimerRef = useRef<number | null>(null);  //ref to manage typing timeout

  //parses the input class diagram text and generates SQL
  const translateText = useCallback((text: string) => {
    const diagram = parseClasses(text);  //parses class definitions from text
    setParsedDiagram(diagram); //stores the parsed class diagram
    setTextRight(diagram);  //updates the translated class diagram

    const sql = generateSQLFromClassDiagram(diagram);  //generates SQL from the parsed diagram
    setSqlTranslation(sql);  //stores the generated SQL
  }, []);

  useEffect(() => {
    const inputElement = document.getElementById("textLeft") as HTMLTextAreaElement;

    //handles input event, triggers translation after delay
    const handleInput = () => {
      if (typingTimerRef.current !== null) {
        clearTimeout(typingTimerRef.current);
      }
      const newText = inputElement.value;
      setTextLeft(newText);
      typingTimerRef.current = window.setTimeout(() => {
        translateText(newText);
      }, 300);
    };

    //handles keyup event, triggers translation after delay
    const handleKeyUp = () => {
      if (typingTimerRef.current !== null) {
        clearTimeout(typingTimerRef.current);
      }
      typingTimerRef.current = window.setTimeout(() => {
        translateText(inputElement.value);
      }, 300);
    };

    //adds event listeners for input and keyup
    inputElement.addEventListener("input", handleInput);
    inputElement.addEventListener("keyup", handleKeyUp);

    return () => {
      //cleans up event listeners and clears the timeout
      inputElement.removeEventListener("input", handleInput);
      inputElement.removeEventListener("keyup", handleKeyUp);
      if (typingTimerRef.current !== null) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, [translateText]); //effect depends on translateText

  //parses class diagram text into a structured format
  const parseClasses = (text: string) => {
    const classRegex = /class (\w+)\s*\{([^}]*)\}/g;
    let diagram = "";//"classDiagram\n";
    let match;

    while ((match = classRegex.exec(text)) !== null) {
      const className = match[1];
      const attributes = match[2]
        .split("\n")
        .map(attr => attr.trim())
        .filter(attr => attr !== "");

      diagram += `class ${className} {\n`;
      attributes.forEach(attr => {
        diagram += `  ${attr}\n`;
      });
      diagram += `}\n`;
    }

    return diagram;
  };

  //generates SQL statements based on the parsed class diagram
  const generateSQLFromClassDiagram = (diagram: string) => {
    const classRegex = /class (\w+)\s*\{\n([^}]*)\n\}/g;
    let sqlStatements = "";
    let match;

    while ((match = classRegex.exec(diagram)) !== null) {
      const className = match[1];
      const attributes = match[2]
        .split("\n")
        .map(attr => attr.trim())
        .filter(attr => attr !== "");

      sqlStatements += `CREATE TABLE ${className} (\n`;

      attributes.forEach((attr) => {
        const [type, name] = attr.split(" ");

        const sqlType = mapTypeToSQL(type);

        sqlStatements += `  ${name} ${sqlType},\n`;
      });

      sqlStatements = sqlStatements.trimEnd().slice(0, -1);  //remove trailing comma
      sqlStatements += "\n);\n\n";
    }

    return sqlStatements;
  };

  //maps class diagram types to SQL types
  const mapTypeToSQL = (type: string) => {
    switch (type) {
      case "int":
        return "INT";
      case "String":
        return "VARCHAR(255)";
      case "double":
        return "DECIMAL(10, 2)";
      default:
        return "TEXT";
    }
  };

  //handles changes to the input text area
  const handleChangeTextLeft = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    setTextLeft(newText);
    if (typingTimerRef.current !== null) {
      clearTimeout(typingTimerRef.current);
    }
    typingTimerRef.current = window.setTimeout(() => {
      translateText(newText);
    }, 300);
  };

  return { textLeft, textRight, handleChangeTextLeft, parsedDiagram, sqlTranslation };
};

export default useAppLogic;
