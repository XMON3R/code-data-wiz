import { Extension } from '@codemirror/state';
import { createEditor } from '../../plugins/plugins-factory';
import { EditorType } from '../../plugins';

// Interface setting up the editor shown in UI
interface EditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  extensions?: Extension[];
  className?: string;
}

// Implementation of CodeMirror component for better visuals and formatting
export function Editor({ value, onChange, readOnly, extensions, className }: EditorProps) {
  return (
    <div className={`h-full flex-1 grow-0 ${className}`}>
      <EditorHeader className="h-10" 
        type={}
        onChangeType={}
      />
      <EditorWrap 
        type={}
        value={}
        onChange={}
      />
    </div>
  );
}

function EditorWrap(props: {
  type: EditorType;
}) {
  const EditorComponent = createEditor(props.type)
  return (
    <EditorComponent
    />
  )
}



/* 

<CodeMirror
        theme="dark"
        value={value}
        width="100%"
        height={`${window.innerHeight}px`}
        onChange={onChange}
        readOnly={readOnly}
        extensions={extensions}
      />
*/