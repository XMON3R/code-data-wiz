import React, { useEffect, ChangeEvent, useState } from "react";
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

export default App;


