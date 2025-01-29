import { useState, useRef, useCallback } from 'react';
import ParserWriter from './parsers/parser-writer';

// Define an interface for the hook's return type
interface TranslationState {
  textLeft: string;
  textRight: string;
  parsedDiagram: string;
  generatedCode: string;
  handleChangeTextLeft: (value: string) => void;
}

// Define an interface for the internal state
interface TranslationControllerState {
  textLeft: string;
  textRight: string;
  parsedDiagram: string;
  generatedCode: string;
}

// Name follwoing React hook naming convention
const useTranslationController = (
  parserWriter: ParserWriter
): TranslationState => {
  const [state, setState] = useState<TranslationControllerState>({
    textLeft: '',
    textRight: '',
    parsedDiagram: '',
    generatedCode: '',
  });

  const typingTimerRef = useRef<number | null>(null);

  // Parses the input and generates the output using the provided ParserWriter
  const translateText = useCallback(
    (text: string) => {
      const parsed = parserWriter.parse(text);
      const generated = parserWriter.generateCode(parsed);

      setState({
        textLeft: text,
        textRight: parsed,
        parsedDiagram: parsed,
        generatedCode: generated,
      });
    },
    [parserWriter]
  );

  // Handles changes to the input text (to be called via CodeMirror onChange)
  const handleChangeTextLeft = (value: string) => {
    setState((prevState) => ({ ...prevState, textLeft: value }));
    if (typingTimerRef.current !== null) {
      clearTimeout(typingTimerRef.current);
    }
    typingTimerRef.current = window.setTimeout(() => {
      translateText(value);
    }, 300);
  };

  return {
    ...state,
    handleChangeTextLeft,
  };
};

export default useTranslationController;
