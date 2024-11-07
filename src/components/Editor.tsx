// src/components/Editor.tsx
import CodeMirror from '@uiw/react-codemirror';

const Editor: React.FC<{ value: string, onChange?: (value: string) => void, readOnly?: boolean, extensions?: any[] }> = ({ value, onChange, readOnly, extensions }) => (
    <CodeMirror
        theme="dark"
        value={value}
        width="100%"
        height={`${window.innerHeight}px`}
        onChange={onChange}
        readOnly={readOnly}
        extensions={extensions}
    />
);

export default Editor;