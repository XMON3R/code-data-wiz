import React, { useEffect, useState } from "react";
import "./styles/index.css";
import useAppLogic from "./app.service";
import CodeMirror from '@uiw/react-codemirror';
//import { HighlightStyle } from "@codemirror/language";
//import {EditorView} from "@codemirror/view"
//import { javascript } from '@codemirror/lang-sql'; // Import a language for syntax highlighting

const App: React.FC = () => {
  const { textLeft, textRight, handleChangeTextLeft, parsedDiagram, sqlTranslation } = useAppLogic();
  const [showSQL, setShowSQL] = useState(false);

  useEffect(() => {}, [parsedDiagram]);

  return (
    <div className="container">
      <CodeMirror
        theme="dark"
        value={textLeft}
        width="300px"
        height="400px"
        //extensions={[javascript()]} // Set language or other extensions
        onChange={(value) => handleChangeTextLeft(value)} // Directly pass the value
      />
      <div className="right-container">
        <CodeMirror
          theme="dark"
          value={showSQL ? sqlTranslation : textRight}
          width="300px"
          height="400px"
          //extensions={[javascript()]} // Set language or other extensions
          readOnly={true} // The right side is read-only
        />
      </div>
      <div className="button-container">
        <button className="toggle-button" onClick={() => setShowSQL(!showSQL)}>
          {showSQL ? "Show Class Diagram" : "Show SQL"}
        </button>
      </div>
    </div>
  );
};

export default App;














/*import React, { useEffect, ChangeEvent, useState } from "react";
import "./styles/index.css";
import useAppLogic from "./app.service";

const App: React.FC = () => {
  const { textLeft, textRight, handleChangeTextLeft, parsedDiagram, sqlTranslation } = useAppLogic();
  const [showSQL, setShowSQL] = useState(false);

  useEffect(() => {}, [parsedDiagram]);

  return (
    <div className="container">
      <textarea
        id="textLeft"
        rows={10}
        placeholder="Enter class definitions here..."
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleChangeTextLeft(e)}
        value={textLeft}
      />
      <div className="right-container">
        <textarea
          id="textRight"
          rows={10}
          placeholder="Transformed text will appear here..."
          readOnly
          value={showSQL ? sqlTranslation : textRight}
        />
      </div>
      <div className="button-container">
        <button className="toggle-button" onClick={() => setShowSQL(!showSQL)}>
          {showSQL ? "Show C-D" : "Show SQL"}
        </button>
      </div>
    </div>
  );

  
};

export default App;*/
