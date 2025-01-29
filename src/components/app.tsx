import React, { useState } from 'react';
import Navbar, { ViewMode } from './switch-navbar.tsx';
import Editor from './code-editor.tsx';
import VerticalSplitter from './vertical-splitter.tsx';
import { sql } from '@codemirror/lang-sql';
import translationController from '../features/translation/translation-controller.tsx'; // Adjusted import path
import SQLParserWriter from '../features/sql-processing/sql-parser.tsx'; // Adjusted import path for SQL writer
import ParserWriter from '../features/translation/parsers/parser-writer.tsx'; // Import ParserWriter interface for type reference

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.ClassDiagram);

  // Dynamically set the ParserWriter instance based on viewMode
  const parserWriter: ParserWriter = (() => {
    switch (viewMode) {
      case ViewMode.ClassDiagram:
        return new SQLParserWriter(); // More Writers for more options to come
      default:
        return new SQLParserWriter(); // Default to SQLParserWriter for now
    }
  })();

  // Use translationController with the dynamically assigned parserWriter
  const { textLeft, textRight, handleChangeTextLeft, generatedCode } =
    translationController(parserWriter);

  //returns an instance of Editor with Codemirror, look in editor.tsx
  return (
    <div className="resize-y h-full bg-gray-900 text-white">
      <Navbar viewMode={viewMode} onToggle={setViewMode} />
      <VerticalSplitter initialSize={50} className="translation">
        <Editor
          value={textLeft}
          onChange={handleChangeTextLeft}
          extensions={[]}
          className="flex-col bg-gray-900 text-white"
        />
        <Editor
          value={viewMode === ViewMode.SQLQuery ? generatedCode : textRight}
          readOnly={true}
          extensions={viewMode === ViewMode.SQLQuery ? [sql()] : []}
        />
      </VerticalSplitter>
    </div>
  );
};

export default App;
