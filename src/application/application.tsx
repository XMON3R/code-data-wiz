import React, { useState, useEffect } from "react";
import { Header } from "./components/header.tsx";
import { VerticalSplitter } from "./components/vertical-splitter.tsx";
import { createDefaultApplicationState } from "./application-state.tsx";
import { useController } from "./application-controller.tsx";
import { Editor } from "./components/editor.tsx";
import { UniversalModel } from "../data-model-api/index.ts";

export const App: React.FC = () => {
    const [state, setState] = useState(createDefaultApplicationState());
    const [error, setError] = useState<string | null>(null);
    const [autoRefreshRightEditor, setAutoRefreshRightEditor] = useState(true);
    const [rightEditorDisplayedContent, setRightEditorDisplayedContent] = useState(state.value);

    useEffect(() => {
        if (autoRefreshRightEditor) {
            setRightEditorDisplayedContent(state.value);
        }
    }, [state.value, autoRefreshRightEditor]);

    const controller = useController(setState);

    const handleLeftError = (error: string | null) => {
        setError(error);
    };

    const handleLeftEditorChange = (newValue: UniversalModel) => {
        setState(prevState => ({
            ...prevState,
            value: newValue,
        }));
    };

    const handleToggleRightEditorAutoRefresh = (newAutoRefresh: boolean) => {
        setAutoRefreshRightEditor(newAutoRefresh);
        if (newAutoRefresh) {
            setRightEditorDisplayedContent(state.value);
        }
    };

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
                    isRightEditor={false}
                />
                <Editor
                    type={state.rightEditorType}
                    onChangeType={controller.onChangeRightEditorType}
                    value={rightEditorDisplayedContent}
                    onChange={() => {}}
                    readOnly={true}
                    className="flex-col bg-gray-900 text-white"
                    error={error}
                    isRightEditor={true}
                    autoRefresh={autoRefreshRightEditor}
                    onToggleAutoRefresh={handleToggleRightEditorAutoRefresh}
                    onTranslateClick={handleTranslateRightEditorClick}
                />
            </VerticalSplitter>
        </div>
    );
};
