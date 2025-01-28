import React from 'react';
import '../output.css';

enum ViewMode {
  ClassDiagram = 'ClassDiagram',
  SQLQuery = 'SQLQuery',
}

interface NavbarProps {
  viewMode: ViewMode;
  onToggle: (mode: ViewMode) => void;
}

/*
interface NavbarProps {
  showSQL: boolean;
  onToggle: (showSQL: boolean) => void; 
}*/

const Navbar: React.FC<NavbarProps> = ({ viewMode, onToggle }) => ( //({ showSQL, onToggle }) => (
  <div className="h-full border-2 border-gray-200 flex">
    <button
      className={`flex-1 bg-gray-600 text-white px-4 py-2 transition-colors duration-300 ${
        //!showSQL ? 'bg-blue-600' : 'hover:bg-gray-700'
        viewMode === ViewMode.ClassDiagram ? 'bg-blue-600' : 'hover:bg-gray-700'
      }`}
      onClick={() => onToggle(ViewMode.ClassDiagram)} //=> onToggle(false)}
    >
      Class Diagram
    </button>
    <button
      className={`flex-1 bg-gray-600 text-white px-4 py-2 transition-colors duration-300 ${
        //showSQL ? 'bg-blue-600' : 'hover:bg-gray-700'
        viewMode === ViewMode.SQLQuery ? 'bg-blue-600' : 'hover:bg-gray-700'
      }`}
      //onClick={() => onToggle(true)}
      onClick={() => onToggle(ViewMode.SQLQuery)}
    >
      SQL Query
    </button>
  </div>
);

export { ViewMode };
export default Navbar;

