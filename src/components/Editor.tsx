// src/components/Editor.tsx
import CodeMirror from '@uiw/react-codemirror';
import { Extension } from '@codemirror/state'; // Adjust based on your setup

const Editor: React.FC<{
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  extensions?: Extension[];
}> = ({ value, onChange, readOnly, extensions }) => (
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
