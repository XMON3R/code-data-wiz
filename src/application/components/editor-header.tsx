import React from "react";
import { EditorType } from "../../plugins";

interface EditorHeaderProps {
    className?: string;
    type: EditorType;
    onChangeType: (value: EditorType) => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({ className, type, onChangeType }) => {

    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = event.target.value as EditorType;
        console.log('EditorHeader: newType selected:', newType);
        onChangeType(newType);
    };

    return (
        <div className={`flex items-center p-2 border-b border-gray-800 ${className}`}>
            <label htmlFor="editor-type" className="mr-2">Editor Type:</label>
            <select id="editor-type" value={type} onChange={handleTypeChange} className="bg-gray-700 text-white rounded-md p-1">
                <option value={EditorType.ClassDiagram}>Class Diagram</option>
                <option value={EditorType.SQLQuery}>SQL Query</option>
                <option value={EditorType.SecondaryEditor}>Secondary</option>
                <option value={EditorType.PlantUML}>PlantUML Diagram</option>
            </select>
            <span className="ml-auto">{"-> " + type}</span> {/* Display current type */}
        </div>
    );
};
