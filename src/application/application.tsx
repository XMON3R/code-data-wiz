import React, { useState, useEffect } from "react";
import { Header } from "./components/header.tsx";
import { VerticalSplitter } from "./components/vertical-splitter.tsx";
import { createDefaultApplicationState } from "./application-state.tsx";
import { useController } from "./application-controller.tsx";
import { Editor } from "./components/editor.tsx";
import { UniversalModel } from "../data-model-api/index.ts";
import { useDownloadHandler } from "./download-handler.ts"; // Import the custom hook

/**
 * The main application component.
 * It sets up the layout with two editors and handles the state management between them.
 */
export const App: React.FC = () => {
    const [state, setState] = useState(createDefaultApplicationState());
    const [error, setError] = useState<string | null>(null);
    const [autoRefreshRightEditor, setAutoRefreshRightEditor] = useState(true);
    const [rightEditorDisplayedContent, setRightEditorDisplayedContent] = useState(state.value);
    const [isDevMode, setIsDevMode] = useState(false);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        setIsDevMode(searchParams.has("dev"));
    }, []);

    // Use the custom hook for download handling
    const { handleDownload, downloadError } = useDownloadHandler();

    useEffect(() => {
        if (autoRefreshRightEditor) {
            setRightEditorDisplayedContent(state.value);
        }
    }, [state.value, autoRefreshRightEditor]);

    // Update the error state if there's a download error
    useEffect(() => {
        if (downloadError) {
            setError(downloadError);
        }
    }, [downloadError]);

    const controller = useController(setState);

    /**
     * Sets the error state.
     * @param error The error message to display.
     */
    const handleLeftError = (error: string | null) => {
        setError(error);
    };

    /**
     * Handles changes in the left editor and updates the application state.
     * @param newValue The new universal model from the editor.
     */
    const handleLeftEditorChange = (newValue: UniversalModel) => {
        setState(prevState => ({
            ...prevState,
            value: newValue,
        }));
    };

    /**
     * Toggles the auto-refresh functionality for the right editor.
     * @param newAutoRefresh The new auto-refresh setting.
     */
    const handleToggleRightEditorAutoRefresh = (newAutoRefresh: boolean) => {
        setAutoRefreshRightEditor(newAutoRefresh);
        if (newAutoRefresh) {
            setRightEditorDisplayedContent(state.value);
        }
    };

    /**
     * Manually triggers the translation for the right editor.
     */
    const handleTranslateRightEditorClick = () => {
        setRightEditorDisplayedContent(state.value);
    };

    return (
        <div className="flex flex-col h-full bg-gray-900 text-white">
            <Header className="flex-shrink-0 h-12" />
            <VerticalSplitter initialSize={50} className="flex-1 min-h-0">
                <Editor
                    type={state.leftEditorType}
                    onChangeType={controller.onChangeLeftEditorType}
                    value={state.value}
                    onChange={handleLeftEditorChange}
                    extensions={[]}
                    className="flex-col bg-gray-900 text-white"
                    onError={handleLeftError}
                    isReadOnly={false}
                    onDownload={handleDownload} // Pass the handler from the hook
                    isDevMode={isDevMode}
                />
                <Editor
                    type={state.rightEditorType}
                    onChangeType={controller.onChangeRightEditorType}
                    value={rightEditorDisplayedContent}
                    onChange={() => {}}
                    isReadOnly={true}
                    className="flex-col bg-gray-900 text-white"
                    error={error} // This error is for editor-specific errors, not download errors
                    autoRefresh={autoRefreshRightEditor}
                    onToggleAutoRefresh={handleToggleRightEditorAutoRefresh}
                    onTranslateClick={handleTranslateRightEditorClick}
                    onDownload={handleDownload} // Pass the handler from the hook
                    isDevMode={isDevMode}
                />
            </VerticalSplitter>
        </div>
    );
};
