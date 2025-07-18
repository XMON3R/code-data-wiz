import { java } from "@codemirror/lang-java";
import { UniversalModel } from "../../data-model-api";
import { useCallback, useEffect, useState } from "react";
import { CodeMirrorEditor } from "../components/code-mirror-editor";
import { debounce } from "../../application/components/debounce";
import { JavaParser } from "./java-parser";
import { JavaWriter } from "./java-writer";
import { JavaAdapter } from "./java-adapter";

/**
 * Props for the JavaEditor component.
 */
interface JavaEditorProps {
    /** The current value of the editor in UniversalModel format. */
    value: UniversalModel;
    /** Callback function when the editor value changes, providing the updated UniversalModel. */
    onChange: (value: UniversalModel) => void;
    /** Whether the editor is read-only. */
    isReadOnly?: boolean;
    /** Callback function for reporting errors during parsing or conversion. */
    onError?: (error: string | null) => void;
}

/**
 * An editor component for Java that handles the full round-trip
 * conversion between text and the UniversalModel.
 * @param props The props for the JavaEditor component.
 */
export function JavaEditor(props: JavaEditorProps) {
    const [writer] = useState(() => new JavaWriter());
    const [adapter] = useState(() => new JavaAdapter());
    const [parser] = useState(() => new JavaParser());

    // This state holds the text currently displayed in the editor.
    const [displayedText, setDisplayedText] = useState<string>("");

    /**
     * This debounced function is responsible for parsing the text
     * and propagating the change to the rest of the application.
     * It converts the Java text to a UniversalModel.
     */
    const propagateChange = useCallback(
        debounce(async (text: string) => {
            try {
                if (text.trim() === '') {
                    props.onChange({ entities: [] });
                    props.onError?.(null);
                    return;
                }

                const domainModel = await parser.parseText(text);
                const newUniversalModel = await adapter.toUniversalModel(domainModel);
                props.onError?.(null); // Clear previous errors on success
                props.onChange(newUniversalModel);
            } catch (e) {
                const error = e as Error;
                props.onError?.(error.message);
                // On error, we DO NOT call props.onChange.
                // This prevents the UniversalModel from being updated, and the
                // other editor pane will remain unchanged.
            }
        }, 500),
        [parser, adapter, props.onChange, props.onError]
    );

    /**
     * This is the immediate handler for when the user types in the CodeMirror editor.
     * It updates the displayed text and triggers the debounced `propagateChange` function.
     * @param newText The new text content from the editor.
     */
    const handleEditorChange = (newText: string) => {
        // 1. Immediately update the text the user sees in the editor.
        setDisplayedText(newText);
        // 2. Trigger the debounced function to process the change.
        propagateChange(newText);
    };
    
    // This effect listens for changes coming FROM the UniversalModel
    // (e.g., from the other editor pane) and updates this editor's text.
    useEffect(() => {
        if (props.isReadOnly) {
            // A simple check to prevent overwriting the user's text
            // if the incoming model is empty while the user is typing.
            if (props.value && props.value.entities.length > 0) {
                adapter.fromUniversalModel(props.value)
                    .then(domainModel => writer.writeText(domainModel))
                    .then(stringValue => {
                        // Only update if the generated text is different from the current text
                        // to avoid cursor jumps and infinite loops.
                        if (stringValue !== displayedText) {
                            setDisplayedText(stringValue);
                        }
                    });
            } else {
                // If the universal model becomes empty, clear the editor.
                setDisplayedText("");
            }
        }
    }, [props.value, props.isReadOnly, adapter, writer, displayedText]); // This effect ONLY runs when the universal model changes.


    return (
        <CodeMirrorEditor
            value={displayedText}
            onChange={handleEditorChange}
            readOnly={props.isReadOnly}
            extensions={[java()]}
        />
    );
}
