import React, { useState } from "react";
import { Header } from "./components/header.tsx";
import { VerticalSplitter } from "./components/vertical-splitter.tsx"; 
import { createDefaultApplicationState } from "./application-state.tsx";
import { useController } from "./application-controller.tsx";
import { Editor } from "./components/editor.tsx";

export const App: React.FC = () => {
    const [state, setState] = useState(createDefaultApplicationState());
    const controller = useController(setState);

    return (
        // Main application container: flex column, full height of #root
        <div className="flex flex-col h-full bg-gray-900 text-white">
            {/* Header: fixed height (e.g., h-12) and prevented from shrinking */}
            <Header className="flex-shrink-0 h-12" />

            {/* VerticalSplitter: takes all remaining vertical space (flex-1), allows shrinking (min-h-0) */}
            <VerticalSplitter initialSize={50} className="flex-1 min-h-0">
                <Editor
                    type={state.leftEditorType}
                    onChangeType={controller.onChangeLeftEditorType}
                    value={state.value}
                    onChange={controller.onChangeValue}
                    extensions={[]}
                    className="flex-col bg-gray-900 text-white"
                />
                <Editor
                    type={state.rightEditorType}
                    onChangeType={controller.onChangeRightEditorType}
                    value={state.value}
                    onChange={controller.onChangeValue}
                    readOnly={true}
                    className="flex-col bg-gray-900 text-white"
                />
            </VerticalSplitter>
        </div>
    );
};