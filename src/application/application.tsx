import React, { useState } from 'react';
import { Header } from './components/header.tsx';
import VerticalSplitter from './components/vertical-splitter.tsx';
import { createDefaultApplicationState } from './application-state.tsx';
import { useController } from './application-controller.tsx';
import { Editor } from './components/editor.tsx';

export const App: React.FC = () => {
    const [state, setState] = useState(createDefaultApplicationState()); // Get state and setState
    const controller = useController(setState); // Pass setState to useController

    return (
        <div className="resize-y h-full bg-gray-900 text-white">
            <Header />
            <VerticalSplitter initialSize={50} className="translation">
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
                />
            </VerticalSplitter>
        </div>
    );
};
