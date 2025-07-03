import { yaml } from "@codemirror/lang-yaml";
import { UniversalModel } from "../../data-model-api";
import { useCallback, useEffect, useState } from "react";
import { CodeMirrorEditor } from "../components/code-mirror-editor";
import { debounce } from "../../application/components/debounce";
import { LinkmlAdapter } from "./linkml-adapter";
import { LinkmlParser } from "./linkml-parser";
import { LinkmlWriter } from "./linkml-writer";

/**
 * An editor component for LinkML that handles the full round-trip
 * conversion between text and the UniversalModel.
 */
export function LinkmlEditor(props: {
    value: UniversalModel;
    onChange: (value: UniversalModel) => void;
    readonly?: boolean;
    onError?: (error: string | null) => void;
}) {
    // Instantiate the LinkML-specific tools
    const writer = new LinkmlWriter();
    const adapter = new LinkmlAdapter();
    const parser = new LinkmlParser();

    // Debounced handler for when the user types in the editor
    const handleEditorChange = useCallback(
        debounce(async (value: string) => {
            try {
                // An empty editor should result in an empty model
                if (value.trim() === '') {
                    props.onChange({ entities: [] });
                    props.onError?.(null);
                    return;
                }

                const domainModel = await parser.parseText(value);
                const newUniversalModel = await adapter.toUniversalModel(domainModel);
                props.onError?.(null);
                props.onChange(newUniversalModel);
            } catch (e) {
                const error = e as Error;
                props.onError?.(error.message);
                console.error("Error handling LinkML editor change:", error);
            }
        }, 500),
        [adapter, parser, props.onChange, props.onError]
    );

    // Local state for the text displayed in the CodeMirror editor
    const [editorValue, setEditorValue] = useState<string>("");

    // Effect to update the editor's text when the universal model prop changes
    useEffect(() => {
        async function updateEditorValue() {
            // Only try to generate text if the model is not empty
            if (props.value && props.value.entities.length > 0) {
                const domainModel = await adapter.fromUniversalModel(props.value);
                const stringValue = await writer.writeText(domainModel);
                setEditorValue(stringValue);
            } else {
                setEditorValue("");
            }
        }
        updateEditorValue();
    }, [props.value, adapter, writer]);


    return (
        <CodeMirrorEditor
            value={editorValue}
            onChange={handleEditorChange}
            readOnly={props.readonly}
            // Use the YAML language extension for syntax highlighting
            extensions={[yaml()]}
        />
    );
}