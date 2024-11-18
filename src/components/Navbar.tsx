import React from 'react';
//import '../styles/index.css';
import '../styles/navbar.css';

interface NavbarProps {
  showSQL: boolean;
  onToggle: (showSQL: boolean) => void; // Adjusted to accept a boolean argument
}

const Navbar: React.FC<NavbarProps> = ({ showSQL, onToggle }) => (
  <div className="navbar">
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
