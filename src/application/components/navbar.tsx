import React from 'react';
import '../../output.css';

// Enum for easy switching of translation "modules"
enum ViewMode {
  ClassDiagram = 'ClassDiagram',
  SQLQuery = 'SQLQuery',
}

// Easily switchable ViewMode interface
interface NavbarProps {
  viewMode: ViewMode;
  onToggle: (mode: ViewMode) => void;
}

// Handling of onClick changes (might transform into a drop-down menu)
const Navbar: React.FC<NavbarProps> = ({ viewMode, onToggle }) => (
  <div className="h-full border-2 border-gray-200 flex">
    <button
      className={`flex-1 bg-gray-600 text-white px-4 py-2 transition-colors duration-300 ${
        viewMode === ViewMode.ClassDiagram ? 'bg-blue-600' : 'hover:bg-gray-700'
      }`}
      onClick={() => onToggle(ViewMode.ClassDiagram)}
    >
      Class Diagram
    </button>
    <button
      className={`flex-1 bg-gray-600 text-white px-4 py-2 transition-colors duration-300 ${
        viewMode === ViewMode.SQLQuery ? 'bg-blue-600' : 'hover:bg-gray-700'
      }`}
      onClick={() => onToggle(ViewMode.SQLQuery)}
    >
      SQL Query
    </button>
  </div>
);

export { ViewMode };
export default Navbar;
