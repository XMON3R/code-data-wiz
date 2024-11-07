/*import React, { useState } from "react";
//import '../styles/global.css';
//import '../styles/translation.css';
import '../styles/translation.css';
import useAppLogic from "../hooks/useAppLogic";
import Navbar from "./Navbar";
import Editor from "./Editor";
import { sql } from '@codemirror/lang-sql';

const App: React.FC = () => {
  const { textLeft, textRight, handleChangeTextLeft, sqlTranslation } = useAppLogic();
  const [showSQL, setShowSQL] = useState(false);

  return (
    <div>
      <Navbar showSQL={showSQL} onToggle={setShowSQL} />
      <div className="translation">
        <Editor value={textLeft} onChange={handleChangeTextLeft} extensions={[]} />
        <Editor value={showSQL ? sqlTranslation : textRight} readOnly={true} extensions={[sql()]} />
      </div>
    </div>
  );
};

export default App;
*/

/*
import React, { useState } from "react";
import { VerticalSplitter } from "../utils/VerticalSplitter";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";

const App: React.FC = () => {
  const [textLeft, setTextLeft] = useState("");
  const [textRight, setTextRight] = useState("");

  return (
    <VerticalSplitter initialSize={50} className="translation">
      <div className="ccontainer" id="input">
        <CodeMirror
          theme="dark"
          value={textLeft}
          height="100vh"
          onChange={(value) => setTextLeft(value)}
          extensions={[sql()]}
        />
      </div>
      <div className="ccontainer">
        <CodeMirror
          theme="dark"
          value={textRight}
          height="100vh"
          readOnly={true}
          extensions={[sql()]}
        />
      </div>
    </VerticalSplitter>
  );
};

export default App;
*/


import React, { useState } from "react";
import "../styles/global.css"
import '../styles/translation.css';
import useAppLogic from "../hooks/useAppLogic";
import Navbar from "./Navbar";
import Editor from "./Editor";
import {VerticalSplitter} from "../utils/VerticalSplitter"; // Import the splitter component
import { sql } from '@codemirror/lang-sql';

const App: React.FC = () => {
  const { textLeft, textRight, handleChangeTextLeft, sqlTranslation } = useAppLogic();
  const [showSQL, setShowSQL] = useState(false);

  return (
    <div>
      <Navbar showSQL={showSQL} onToggle={setShowSQL} />
      <VerticalSplitter initialSize={50} className="translation">
        <Editor value={textLeft} onChange={handleChangeTextLeft} extensions={[]} />
        <Editor value={showSQL ? sqlTranslation : textRight} readOnly={true} extensions={[sql()]} />
      </VerticalSplitter>
    </div>
  );
};

export default App;
