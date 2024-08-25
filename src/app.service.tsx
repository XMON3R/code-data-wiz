import { useState, useEffect } from 'react';

const useAppLogic = () => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  let typingTimer: any;

  useEffect(() => {
    const inputElement = document.getElementById('text1') as HTMLTextAreaElement;
    //const outputElement = document.getElementById('text2') as HTMLTextAreaElement; // Added id for the output textarea
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

  const translateText = (text: string) => {
    const transformedText = text.toUpperCase();
    setText2(transformedText);
    const outputElement = document.getElementById('text2') as HTMLTextAreaElement; // Get the output textarea
    outputElement.value = transformedText; // Set the value of the output textarea
  };

  const handleChangeText1 = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    setText1(newText);
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      translateText(newText);
    }, 300);
  };

  return { text1, text2, handleChangeText1 };
};

export default useAppLogic;
