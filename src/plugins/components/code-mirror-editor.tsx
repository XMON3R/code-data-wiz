import CodeMirror from '@uiw/react-codemirror';
import { Extension } from '@codemirror/state'; 

interface CodeMirrorEditorProps { 
    value: string;
    onChange: (value: string) => void;
    readOnly?: boolean;
    extensions?: Extension[];
}

export function CodeMirrorEditor(props: CodeMirrorEditorProps) { 
    return (
        <CodeMirror
            theme="dark"
            value={props.value} 
            width="100%"
            height={`${window.innerHeight}px`}
            onChange={props.onChange}
            readOnly={props.readOnly}
            extensions={props.extensions} 
        />
    );
}
