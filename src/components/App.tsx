import React, { useState } from 'react';
import useAppLogic from '../hooks/useAppLogic';
import Navbar from './Navbar';
import Editor from './Editor';
import { VerticalSplitter } from '../utils/VerticalSplitter';
import { sql } from '@codemirror/lang-sql';
import '../styles/output.css';

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

export default App;
