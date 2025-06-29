import CodeMirror from "@uiw/react-codemirror";
import { Extension } from "@codemirror/state";
import { useEffect, useState } from "react";

interface CodeMirrorEditorProps {
    value: string;
    onChange: (value: string) => void;
    readOnly?: boolean;
    extensions?: Extension[];
}

export function CodeMirrorEditor(props: CodeMirrorEditorProps) {
    const [internalValue, setInternalValue] = useState(props.value);

    useEffect(() => {
        setInternalValue(props.value);
    }, [props.value]);

    const handleChange = (newValue: string) => {
        setInternalValue(newValue);
        props.onChange(newValue);
    };

    return (
        <CodeMirror
            theme="dark"
            value={internalValue}
            width="100%"
            height="100%"
            onChange={handleChange}
            readOnly={props.readOnly}
            extensions={props.extensions}
        />
    );
}
