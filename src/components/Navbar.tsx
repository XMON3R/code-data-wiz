import React from 'react';
//import '../styles/index.css';

import '../styles/output.css';
//import '../styles/navbar.css';

interface NavbarProps {
  showSQL: boolean;
  onToggle: (showSQL: boolean) => void; 
}

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

