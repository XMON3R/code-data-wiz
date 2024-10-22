import React, { useEffect, useState } from "react";
import "./styles/index.css";
import useAppLogic from "./app.service";
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql'; 
//import { HighlightStyle} from "@codemirror/language";
import { EditorView } from "@codemirror/view";

const App: React.FC = () => {
  //const { textLeft, textRight, handleChangeTextLeft, parsedDiagram, sqlTranslation } = useAppLogic();
  const { textLeft, textRight, handleChangeTextLeft, sqlTranslation } = useAppLogic();
  const [showSQL, setShowSQL] = useState(false);
  const [editorHeight, setEditorHeight] = useState(window.innerHeight); //adjust here if needed

  //dynamic resizing
  useEffect(() => {
    const updateEditorHeight = () => {
      const newHeight = window.innerHeight;
      setEditorHeight(newHeight);
    };

    window.addEventListener("resize", updateEditorHeight);
    return () => window.removeEventListener("resize", updateEditorHeight);
  }, []);

  return (
    <div>
      <b>Choose Output format:</b>
    <div className="navbar">
        <button
          className={`nav-button ${!showSQL ? 'active' : ''}`}
          onClick={() => setShowSQL(false)}
        >
          Class Diagram
        </button>
        <button
          className={`nav-button ${showSQL ? 'active' : ''}`}
          onClick={() => setShowSQL(true)}
        >
          SQL Query
        </button>
      </div> 

    <div className="translation">
      <div className="ccontainer" id="input">
        <CodeMirror
          theme="dark"
          value={textLeft}
          width="100%"
          height={`${editorHeight}px`}  //dynamic
          onChange={(value) => handleChangeTextLeft(value)}
          extensions={[
            EditorView.lineWrapping,
          ]}
          
        />
      </div>
      <div className="ccontainer">
        <CodeMirror
          theme="dark"
          value={showSQL ? sqlTranslation : textRight}
          width="100%"
          height={`${editorHeight}px`}  //dynamic
          readOnly={true}
          extensions={[
            EditorView.lineWrapping,
            sql()
          ]}
        />
      </div>
      </div>
    </div>
  );
};

export default App;