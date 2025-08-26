import React from "react";
import { EditorType } from "../../plugins";

// Props for the EditorHeader component
interface EditorHeaderProps {
    className?: string; // Optional custom CSS class for layout styling
    type: EditorType; // Current selected editor type (e.g., Java, SQL)
    onChangeType: (value: EditorType) => void; // Handler to update editor type
    autoRefresh: boolean; // Whether auto-refresh is enabled
    onToggleAutoRefresh: (autoRefresh: boolean) => void; // Handler for toggling auto-refresh
    onTranslateClick: () => void; // Handler for manual translation trigger
    isReadOnly?: boolean; // Indicates if the editor is read-only (typically the right-side viewer)
    onDownload: () => void; // Handler for downloading current content
    isDevMode: boolean; // Whether the app is running in developer mode
}

// EditorHeader renders the toolbar above each editor with options for selecting editor type,
// toggling auto-refresh, triggering translation manually, and downloading output.
export const EditorHeader: React.FC<EditorHeaderProps> = ({
    className,
    type,
    onChangeType,
    autoRefresh,
    onTranslateClick,
    isReadOnly,
    onDownload,
    isDevMode
}) => {

    // Handler for changing the selected editor type
    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = event.target.value as EditorType;
        console.log('EditorHeader: newType selected:', newType);
        onChangeType(newType);
    };

    return (
        <div className={`flex items-center p-2 border-b border-gray-800 ${className}`}>
            <label htmlFor="editor-type" className="mr-2">Editor Type:</label>

            {/* Dropdown to select which editor type to use */}
            <select
                id="editor-type"
                value={type}
                onChange={handleTypeChange}
                className="bg-gray-700 text-white rounded-md p-1"
            >
                <option value={EditorType.Csharp}>C#</option>
                {isDevMode && <option value={EditorType.ClassDiagram}>Class Diagram</option>}
                <option value={EditorType.Java}>Java</option>
                <option value={EditorType.JsonSchema}>JsonSchema</option>
                <option value={EditorType.LinkML}>LinkML</option>
                {isReadOnly && <option value={EditorType.PlantUML}>PlantUML Diagram</option>}
                <option value={EditorType.SQLQuery}>SQL Query</option>
            </select>

            {/* Toggle for auto-refresh, shown only for read-only (right-side) editors */}
            {isReadOnly && (
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

            {/* Right-aligned button section */}
            <div className="ml-auto flex items-center">
                {/* Show Translate button only when auto-refresh is off in the right-side editor */}
                {isReadOnly && !autoRefresh && (
                    <button
                        onClick={onTranslateClick}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-2"
                    >
                        Translate
                    </button>
                )}

                {/* Always show Download button */}
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
