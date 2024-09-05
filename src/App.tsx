import React, { useEffect, useRef, ChangeEvent } from 'react';
import './styles/index.css';
import useAppLogic from './app.service';

const App: React.FC = () => {
  const { text1, text2, handleChangeText1, parsedDiagram } = useAppLogic();
  const diagramContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    /*
    if (parsedDiagram) {
      render({
        code: parsedDiagram,
        container: diagramContainerRef.current,
      });
    }
    */
  }, [parsedDiagram]);

  return (
    <div className="textarea-container">
      <textarea
        id="text1"
        rows={10}  // Make the first textarea longer
        cols={50}
        placeholder="Enter class definitions here..."
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleChangeText1(e)}
        value={text1} 
      />
      <textarea
        id="text2"
        rows={10}  // Make the second textarea longer
        cols={50}
        placeholder="Transformed text will appear here..."
        readOnly
        value={text2} 
      />
      <div ref={diagramContainerRef} className="diagram-container" />
    </div>
  );
};

export default App;

/*

import React, { useEffect, useRef, ChangeEvent } from 'react';
import './styles/index.css';
import useAppLogic from './app.service';
// import { render } from '@pintora/cli';

const App: React.FC = () => {
  const { text1, text2, handleChangeText1, parsedDiagram } = useAppLogic();
  const diagramContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {

    */

    
    /*
    if (parsedDiagram) {
      render({
        code: parsedDiagram,
        container: diagramContainerRef.current,
      });
    }
    */

    /*
  }, [parsedDiagram]);

  return (
    <div className="textarea-container">
      <textarea
        id="text1"
        rows={5}
        cols={50}
        placeholder="Enter class definitions here..."
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleChangeText1(e)}
        value={text1} // Bind value to text1
      />
      <textarea
        id="text2"
        rows={5}
        cols={50}
        placeholder="Transformed text will appear here..."
        readOnly
        value={text2} // Bind value to text2
      />
      <div ref={diagramContainerRef} className="diagram-container" />
    </div>
  );
};

export default App;
*/