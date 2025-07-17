import { UniversalModel } from "../../data-model-api";
import { useCallback, useEffect, useState } from "react";
import { CodeMirrorEditor } from "../components/code-mirror-editor";
import { debounce } from "../../application/components/debounce";
import { OfnAdapter } from "./ofn-adapter";
import { OfnParser } from "./ofn-parser";
import { OfnWriter } from "./ofn-writer";
import { json } from "@codemirror/lang-json"; // Import JSON language support for CodeMirror

/**
 * A fully functional OFN editor component that integrates the parser,
 * writer, and adapter to translate between OFN JSON and the UniversalModel.
 */
export function OfnEditor(props: {
    value: UniversalModel;
    onChange: (value: UniversalModel) => void;
    isReadOnly?: boolean;
    onError?: (error: string | null) => void;
}) {
    const { onChange, onError } = props;
    // Use single instances of the adapter, writer, and parser.
    const [writer] = useState(() => new OfnWriter());
    const [adapter] = useState(() => new OfnAdapter());
    const [parser] = useState(() => new OfnParser());

    // This state holds the text currently displayed in the editor.
    const [displayedText, setDisplayedText] = useState<string>("");

    // This debounced function is responsible for parsing the text
    // and propagating the change to the rest of the application.
    const propagateChange = useCallback(
        debounce(async (text: string) => {
            try {
                if (text.trim() === '') {
                    onChange({ entities: [] });
                    onError?.(null);
                    return;
                }

                const domainModel = await parser.parseText(text);
                const newUniversalModel = await adapter.toUniversalModel(domainModel);
                onError?.(null); // Clear previous errors on success
                onChange(newUniversalModel);
            } catch (e) {
                const error = e as Error;
                onError?.(error.message);
                // On error, we DO NOT call props.onChange.
                // This prevents the UniversalModel from being updated, and the
                // other editor pane will remain unchanged.
            }
        }, 500),
        [parser, adapter, onChange, onError]
    );

    // This is the immediate handler for when the user types.
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
            if (props.value && props.value.entities && props.value.entities.length > 0) {
                adapter.fromUniversalModel(props.value)
                    .then(domainModel => writer.writeText(domainModel))
                    .then(stringValue => {
                        // Only update if the generated text is different from the current text
                        // to avoid cursor jumps and infinite loops.
                        if (stringValue !== displayedText) {
                            setDisplayedText(stringValue);
                        }
                    })
                    .catch(e => {
                        console.error("Error generating OFN code from UniversalModel:", e);
                        onError?.("Error generating OFN code.");
                    });
            } else {
                // If the universal model becomes empty, clear the editor.
                setDisplayedText("");
            }
        }
    }, [props.value, props.isReadOnly, adapter, writer, displayedText, onError]); // This effect ONLY runs when the universal model changes.


    return (
        <CodeMirrorEditor
            value={displayedText}
            onChange={handleEditorChange}
            readOnly={props.isReadOnly}
            extensions={[json()]} // Use JSON language extension for OFN
        />
    );
}
