import React from "react";
import { EditorType } from "../../plugins";

interface EditorHeaderProps {
    className?: string;
    type: EditorType;
    onChangeType: (value: EditorType) => void;
    autoRefresh: boolean;
    onToggleAutoRefresh: (autoRefresh: boolean) => void;
    onTranslateClick: () => void;
    isReadOnly?: boolean;
    onDownload: () => void; 
    isDevMode: boolean;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({ className, type, onChangeType, autoRefresh, onTranslateClick, isReadOnly, onDownload, isDevMode }) => {

    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = event.target.value as EditorType;
        console.log('EditorHeader: newType selected:', newType);
        onChangeType(newType);
    };

    return (
        <div className={`flex items-center p-2 border-b border-gray-800 ${className}`}>
            <label htmlFor="editor-type" className="mr-2">Editor Type:</label>
            <select id="editor-type" value={type} onChange={handleTypeChange} className="bg-gray-700 text-white rounded-md p-1">
                <option value={EditorType.Csharp}>C#</option>
                {isDevMode && <option value={EditorType.ClassDiagram}>Class Diagram</option>}
                <option value={EditorType.Java}>Java</option>
                <option value={EditorType.JsonSchema}>JsonSchema</option>
                <option value={EditorType.LinkML}>LinkML</option>
                <option value={EditorType.Ofn}>Ofn</option>
                {isReadOnly && <option value={EditorType.PlantUML}>PlantUML Diagram</option>}
                <option value={EditorType.SQLQuery}>SQL Query</option>
                
            </select>

            {isReadOnly && ( // Conditionally render for right editor only
                <div className="ml-4 flex items-center">
                    <label htmlFor="auto-refresh-toggle" className="mr-2">Auto-refresh:</label>
                    <input
                        type="checkbox"
                        id="auto-refresh-toggle"
                        checked={autoRefresh}
                        className="form-checkbox h-4 w-4 text-blue-600"
                    />
                </div>
            )}

            <div className="ml-auto flex items-center"> {/* Added flex items-center to align buttons */}
                {isReadOnly && !autoRefresh && ( // Conditionally render for right editor and autoRefresh is off
                    <button
                        onClick={onTranslateClick}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-2" // Added mr-2 for spacing
                    >
                        Translate
                    </button>
                )}
                {/* Download button */}
                <button
                    onClick={onDownload}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
                >
                    Download
                </button>
            </div>
        </div>
    );
};
