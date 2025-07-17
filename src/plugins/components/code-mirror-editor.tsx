import CodeMirror from "@uiw/react-codemirror";
import { Extension } from "@codemirror/state";
import { useEffect, useState } from "react";

/**
 * Props for the CodeMirrorEditor component.
 */
interface CodeMirrorEditorProps {
    /** The current value of the editor. */
    value: string;
    /** Callback function when the editor value changes. */
    onChange: (value: string) => void;
    /** Whether the editor is read-only. */
    readOnly?: boolean;
    /** CodeMirror extensions to apply. */
    extensions?: Extension[];
}

/**
 * A CodeMirror editor component.
 * @param props The props for the CodeMirrorEditor component.
 */
export function CodeMirrorEditor(props: CodeMirrorEditorProps) {
    const [internalValue, setInternalValue] = useState(props.value);

    useEffect(() => {
        setInternalValue(props.value);
    }, [props.value]);

    /**
     * Handles changes to the editor's value.
     * Updates the internal state and calls the onChange prop.
     * @param newValue The new value from the editor.
     */
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
