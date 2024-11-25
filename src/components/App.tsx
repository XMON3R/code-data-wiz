/*import React, { useState } from 'react';
//import '../styles/global.css';
//import '../../build/css/global_new.css';
import '../styles/translation.css';
import useAppLogic from '../hooks/useAppLogic';
import Navbar from './Navbar';
import Editor from './Editor';
import { VerticalSplitter } from '../utils/VerticalSplitter'; // Import the splitter component
import { sql } from '@codemirror/lang-sql';

import '../styles/output.css';

const App: React.FC = () => {
  const { textLeft, textRight, handleChangeTextLeft, sqlTranslation } = useAppLogic();
  const [showSQL, setShowSQL] = useState(false);

  //<Navbar showSQL={showSQL} onToggle={setShowSQL} />
  return (
    <div className="h-full bg-gray-900 text-white font-bold">
      
      <VerticalSplitter initialSize={50} className="translation flex h-full text-lg">
        <div className="flex-1 h-full p-0">
          <button>a</button>
          <Editor
            value={textLeft}
            onChange={handleChangeTextLeft}
            extensions={[]}
           // className="flex-1 bg-gray-800 p-4"
          />
        </div>
        <div className="flex-1 h-full p-0">
        <button>a</button>
          <Editor
            value={showSQL ? sqlTranslation : textRight}
            readOnly={true}
            extensions={[sql()]}
            // className="flex-1 bg-gray-800 p-4"
          />
        </div>
      </VerticalSplitter>
    </div>
  );
};
*/
import React, { useState } from 'react';
import useAppLogic from '../hooks/useAppLogic';
import Navbar from './Navbar';
import Editor from './Editor';
import { VerticalSplitter } from '../utils/VerticalSplitter'; // Import the splitter component
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
          className="flex flex-col flex-grow h-screen bg-gray-900 text-white"
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
