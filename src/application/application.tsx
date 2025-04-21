import React, { useState } from 'react';

//import { sql } from '@codemirror/lang-sql';

//import Navbar, { ViewMode } from './components/navbar.tsx';
//import { Header, ViewMode } from './components/header.tsx';

import { Header } from './components/header.tsx';

//import Editor from './components/editor.tsx';
import VerticalSplitter from './components/vertical-splitter.tsx';
//import translationController from './controllers/translation-controller.tsx'
//import SQLParserWriter from '../plugins/sql-processing/sql-parser.tsx'; // Adjusted import path for SQL writer
//import ParserWriter from '../data-model-api/old_parsers/parser-writer.tsx'; // Import ParserWriter interface for type reference
import { createDefaultApplicationState } from './application-state.tsx';
import { useController } from './application-controller.tsx';
import { Editor } from './components/editor.tsx';

/* 
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

*/


const App: React.FC = () => {
  //const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.ClassDiagram);
  const [state, setState] = useState(createDefaultApplicationState());
  const controller = useController(useState)

  //returns an instance of Editor with Codemirror, look in editor.tsx
  
  /*
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
  ); */

    
  
  return (
    <div className="resize-y h-full bg-gray-900 text-white">
      <Header />
      <VerticalSplitter initialSize={50} className="translation">
        <Editor
          type={state.leftEditorType}
          onChangeType={controller.onChangeLeftEditorType}
          value={state.value}
          onChange={controller.onChangeValue}
          extensions={[]}
          className="flex-col bg-gray-900 text-white"
        />
        <Editor
          type={state.rightEditorType}
          onChangeType={controller.onChangeRightEditorType}
          value={state.value}
          onChange={controller.onChangeValue}
          readOnly={true}
        >
        </Editor>
      </VerticalSplitter>
    </div>
  ); 

};


//extensions={state.rightEditorType === 'sql' ? [sql()] : []}


export default App;
