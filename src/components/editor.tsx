import CodeMirror from '@uiw/react-codemirror';
import { Extension } from '@codemirror/state';
import '../output.css';

// Interface setting up the editor shown in UI
interface EditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  extensions?: Extension[];
  className?: string;
}

// Implementation of CodeMirror component for better visuals and formatting
function Editor({ value, onChange, readOnly, extensions, className }: EditorProps) {
  return (
    <div className={`h-full flex-1 grow-0 ${className}`}>
      <CodeMirror
        theme="dark"
        value={value}
        width="100%"
        height={`${window.innerHeight}px`}
        onChange={onChange}
        readOnly={readOnly}
        extensions={extensions}
      />
    </div>
  );
}

export default Editor;
