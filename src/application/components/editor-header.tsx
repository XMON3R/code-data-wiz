import React from "react";
import { EditorType } from "../../plugins";

interface EditorHeaderProps {
    className?: string;
    type: EditorType;
    onChangeType: (value: EditorType) => void;
    autoRefresh: boolean;
    onToggleAutoRefresh: (autoRefresh: boolean) => void;
    onTranslateClick: () => void;
    isRightEditor?: boolean; // New prop
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({ className, type, onChangeType, autoRefresh, onToggleAutoRefresh, onTranslateClick, isRightEditor }) => {

    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = event.target.value as EditorType;
        console.log('EditorHeader: newType selected:', newType);
        onChangeType(newType);
    };

    const handleToggleChange = () => {
        onToggleAutoRefresh(!autoRefresh);
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

            {isRightEditor && ( // Conditionally render for right editor only
                <div className="ml-4 flex items-center">
                    <label htmlFor="auto-refresh-toggle" className="mr-2">Auto-refresh:</label>
                    <input
                        type="checkbox"
                        id="auto-refresh-toggle"
                        checked={autoRefresh}
                        onChange={handleToggleChange}
                        className="form-checkbox h-4 w-4 text-blue-600"
                    />
                </div>
            )}

            <div className="ml-auto">
                {isRightEditor && !autoRefresh && ( // Conditionally render for right editor and autoRefresh is off
                    <button
                        onClick={onTranslateClick}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                    >
                        Translate
                    </button>
                )}
            </div>
        </div>
    );
};
