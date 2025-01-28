import CodeMirror from '@uiw/react-codemirror';
import { Extension } from '@codemirror/state';
import '../output.css';

interface EditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  extensions?: Extension[];
  className?: string;  
}

const Editor: React.FC<EditorProps> = ({ value, onChange, readOnly, extensions, className }) => (
  <div className={`h-full flex-1 grow-0 ${className}`}> {}
    <CodeMirror
      theme="dark"
      value={value}
      width="100%"
      height={`${window.innerHeight}px`}
      //height="100%" 
      onChange={onChange}
      readOnly={readOnly}
      extensions={extensions}
    />
  </div>
);

export default Editor;
