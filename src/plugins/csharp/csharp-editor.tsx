import { java } from "@codemirror/lang-java";
import { UniversalModel } from "../../data-model-api";
import { useCallback, useEffect, useState } from "react";
import { CodeMirrorEditor } from "../components/code-mirror-editor";
import { debounce } from "../../application/components/debounce";
import { CSharpAdapter } from "./csharp-adapter";
import { CSharpTextParser } from "./csharp-parser";
import { SimpleCSharpWriter } from "./csharp-writer";

/**
 * A fully functional C# editor component that integrates the parser,
 * writer, and adapter to translate between C# code and the UniversalModel.
 */
export function CSharpEditor(props: {
    value: UniversalModel;
    onChange: (value: UniversalModel) => void;
    isReadOnly?: boolean;
    onError?: (error: string | null) => void;
}) {
    // Use single instances of the adapter, writer, and parser.
    const [writer] = useState(() => new SimpleCSharpWriter());
    const [adapter] = useState(() => new CSharpAdapter());
    const [parser] = useState(() => new CSharpTextParser());

    // This state holds the text currently displayed in the editor.
    const [displayedText, setDisplayedText] = useState<string>("");

    // This debounced function is responsible for parsing the text
    // and propagating the change to the rest of the application.
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
            if (props.value && props.value.entities.length > 0) {
                adapter.fromUniversalModel(props.value)
                    .then(domainModel => writer.generateCode(domainModel))
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
            //java here, because no official c# language extension exists
            extensions={[java()]}
        />
    );
}
