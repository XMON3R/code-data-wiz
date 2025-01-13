import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app.tsx';
//import "./styles/index.css"
import "./styles/output.css"

//root render
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
