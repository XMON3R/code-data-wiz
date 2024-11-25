import React from 'react';
import '../styles/index.css';

import '../styles/output.css';
//import '../styles/navbar.css';

interface NavbarProps {
  showSQL: boolean;
  onToggle: (showSQL: boolean) => void; // Adjusted to accept a boolean argument
}

/*
const Navbar: React.FC<NavbarProps> = ({ showSQL, onToggle }) => (
  <div className="h-12 flex items-center">
    <button
      className={`nav-button ${!showSQL ? 'active' : ''}`}
      onClick={() => onToggle(false)} // Pass false to show the class diagram
    >
      Class Diagram
    </button>
    <button
      className={`nav-button ${showSQL ? 'active' : ''}`}
      onClick={() => onToggle(true)} // Pass true to show the SQL query
    >
      SQL Query
    </button>
  </div>
);

export default Navbar;

*/
/*
const Navbar: React.FC<NavbarProps> = ({ showSQL, onToggle }) => (
  //<div className="h-12 flex items-center">
  <div className="h-full border-2 border-gray-200">  
    <button
      className={`bg-gray-600 text-white px-4 py-2 m-0 border-none cursor-pointer transition-colors duration-300 ${
        !showSQL ? 'bg-blue-600' : 'hover:bg-gray-700'
      }`}
      onClick={() => onToggle(false)} // Pass false to show the class diagram
    >
      Class Diagram
    </button>
    <button
      className={`bg-gray-600 text-white px-4 py-2 m-0 border-none cursor-pointer transition-colors duration-300 ${
        showSQL ? 'bg-blue-600' : 'hover:bg-gray-700'
      }`}
      onClick={() => onToggle(true)} // Pass true to show the SQL query
    >
      SQL Query
    </button>
  </div>
);


export default Navbar;
*/


const Navbar: React.FC<NavbarProps> = ({ showSQL, onToggle }) => (
  <div className="h-full border-2 border-gray-200 flex">
    <button
      className={`flex-1 bg-gray-600 text-white px-4 py-2 transition-colors duration-300 ${
        !showSQL ? 'bg-blue-600' : 'hover:bg-gray-700'
      }`}
      onClick={() => onToggle(false)}
    >
      Class Diagram
    </button>
    <button
      className={`flex-1 bg-gray-600 text-white px-4 py-2 transition-colors duration-300 ${
        showSQL ? 'bg-blue-600' : 'hover:bg-gray-700'
      }`}
      onClick={() => onToggle(true)}
    >
      SQL Query
    </button>
  </div>
);

export default Navbar;

