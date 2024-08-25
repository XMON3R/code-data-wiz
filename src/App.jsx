import React from 'react';
import './index.css';
import useAppLogic from './app.service';

const App = () => {
const { text1, text2, handleChangeText1 } = useAppLogic();
  return (
    <div className="textarea-container">
      <textarea
        id="text1"
        rows={5}
        cols={50}
        placeholder="Enter text here..."
      />
      <textarea
        id="text2"
        rows={5}
        cols={50}
        placeholder="Transformed text will appear here..."
      />
    </div>
  );
};

export default App;


/* import React, { useState, useEffect } from 'react';
import './index.css'; 

const App = () => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  let typingTimer;

  useEffect(() => {
    const inputElement = document.getElementById('text1');
    const handleInput = () => {
      clearTimeout(typingTimer);
      const newText = inputElement.value;
      setText1(newText);
      typingTimer = setTimeout(() => {
        translateText(newText);
      }, 300);
    };
    const handleKeyUp = () => {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        translateText(inputElement.value);
      }, 300);
    };
    inputElement.addEventListener('input', handleInput);
    inputElement.addEventListener('keyup', handleKeyUp);
    return () => {
      inputElement.removeEventListener('input', handleInput);
      inputElement.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const translateText = (text) => {
    const transformedText = text.toUpperCase();
    setText2(transformedText);
  };

  const handleChangeText1 = (event) => {
    const newText = event.target.value;
    setText1(newText);
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      translateText(newText);
    }, 300);
  };

  return (
    <div className="textarea-container">
      <textarea
        id="text1"
        rows={5}
        cols={50}
        value={text1}
        onChange={handleChangeText1}
        placeholder="Enter text here..."
      />
      <textarea
        rows={5}
        cols={50}
        value={text2}
        onChange={(e) => setText2(e.target.value.toUpperCase())}
        placeholder="Transformed text will appear here..."
      />
    </div>
  );
};

export default App; */