/*import React, { useState } from 'react';
import useAppLogic from './translationController';
import Navbar, {ViewMode} from './navbar';
import Editor from './editor';
import { VerticalSplitter } from './verticalSplitter';
import { sql } from '@codemirror/lang-sql';
import '../styles/output.css';
import ParserWriter from '../utils/parserWriter';
import ClassParser from '../utils/newclassParser';

*/

/*
const App: React.FC = () => {
  const { textLeft, textRight, handleChangeTextLeft, sqlTranslation } =
    useAppLogic();
  const [showSQL, setShowSQL] = useState(false);

  
  return (
    <div className="resize-y h-full bg-gray-900 text-white">
      <Navbar showSQL={showSQL} onToggle={setShowSQL} />
      <VerticalSplitter initialSize={50} className="translation">
        
        <Editor
          value={textLeft}
          onChange={handleChangeTextLeft}
          extensions={[]}
          className="flex-col bg-gray-900 text-white"
        />
        <Editor
          value={showSQL ? sqlTranslation : textRight}
          readOnly={true}
          extensions={[sql()]}
        />
      </VerticalSplitter>
    </div>
  );
};
*/


/*
const App: React.FC = () => {
  const { textLeft, textRight, handleChangeTextLeft, sqlTranslation } = useAppLogic();
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.ClassDiagram)

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
        value={viewMode === ViewMode.SQLQuery ? sqlTranslation : textRight}
        readOnly={true}
        extensions={[sql()]}
      />
    </VerticalSplitter>
  </div>
);
};

export default App;
*/





import React, { useState } from 'react';
import Navbar, {ViewMode} from './navbar';
import Editor from './editor';
import VerticalSplitter from './verticalSplitter';
import { sql } from '@codemirror/lang-sql';
import translationController from './translationController'; // Adjusted import path
import SQLParserWriter from '../utils/sqlParser'; // Adjusted import path for SQL writer
import ParserWriter from '../utils/parserWriter'; // Import ParserWriter interface for type reference

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.ClassDiagram);

  // Dynamically set the ParserWriter instance based on viewMode
  const parserWriter: ParserWriter = (() => {
    switch (viewMode) {
      case ViewMode.ClassDiagram:
        return new SQLParserWriter(); // Add more writers for additional view modes
      default:
        return new SQLParserWriter(); // Default to SQLParserWriter
    }
  })();

  // Use translationController with the dynamically assigned parserWriter
  //const { textLeft, textRight, handleChangeTextLeft, parsedDiagram, generatedCode } =
  const { textLeft, textRight, handleChangeTextLeft, generatedCode } =
    translationController(parserWriter);

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











/*
const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.ClassDiagram);

  // Dynamically set the ParserWriter instance based on viewMode
  const parserWriter: ParserWriter = (() => {
    switch (viewMode) {
      case ViewMode.ClassDiagram:
        return new ClassParserWriter(); // Implementation for class diagrams and SQL
      // Add more cases here for additional view modes and parser writers
      default:
        return new ClassParserWriter(); // Default fallback
    }
  })();

  // Pass the parserWriter instance to the hook
  const { textLeft, textRight, handleChangeTextLeft, generatedCode } = useAppLogic(parserWriter);

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
*/