//import { csharp } from "@codemirror/lang-csharp";
import { useEffect, useState } from "react";
import { UniversalModel } from "../../data-model-api";
import { CodeMirrorEditor } from "../components/code-mirror-editor";
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
    readonly?: boolean;
    onError?: (error: string | null) => void;
}) {
    const [editorValue, setEditorValue] = useState<string>("");

    // Use single instances of the adapter, writer, and parser.
    const [adapter] = useState(() => new CSharpAdapter());
    const [writer] = useState(() => new SimpleCSharpWriter());
    const [parser] = useState(() => new CSharpTextParser());

    /**
     * Effect to update the editor's text content when the incoming `UniversalModel` prop changes.
     * This is the "write" path: UniversalModel -> CSharpModel -> C# string.
     */
    useEffect(() => {
        const updateEditorContent = async () => {
            try {
                const csharpModel = await adapter.fromUniversalModel(props.value);
                const csharpString = writer.generateCode(csharpModel);
                setEditorValue(csharpString);
            } catch (e) {
                const error = e as Error;
                props.onError?.(error.message);
                console.error("Error converting UniversalModel to C# string:", error);
            }
        };
        updateEditorContent();
    }, [props.value, adapter, writer, props.onError]);

    /**
     * Handles changes from the CodeMirror editor instance.
     * This is the "read" path: C# string -> CSharpModel -> UniversalModel.
     * @param value The new string value from the editor.
     */
    const handleEditorChange = async (value: string) => {
        try {
            const csharpModel = await parser.parseText(value);
            const newUniversalModel = await adapter.toUniversalModel(csharpModel);
            props.onError?.(null); // Clear any previous errors
            props.onChange(newUniversalModel);
        } catch (e) {
            const error = e as Error;
            props.onError?.(error.message);
            // We don't log the error here to avoid console noise on every invalid keystroke.
            // The error is passed up to the parent component to be displayed in the UI.
        }
    };

    return (
        <CodeMirrorEditor
            value={editorValue}
            onChange={handleEditorChange}
            readOnly={props.readonly}
            //extensions={[csharp()]}
        />
    );
}
