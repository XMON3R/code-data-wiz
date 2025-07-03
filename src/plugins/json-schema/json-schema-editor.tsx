import { json } from "@codemirror/lang-json";
import { UniversalModel } from "../../data-model-api";
import { useCallback, useEffect, useState } from "react";
import { CodeMirrorEditor } from "../components/code-mirror-editor";
import { debounce } from "../../application/components/debounce";
import { JsonSchemaAdapter } from "./json-schema-adapter";
import { JsonSchemaParser } from "./json-schema-parser";
import { JsonSchemaWriter } from "./json-schema-writer";

/**
 * An editor component for JSON Schema that handles the full round-trip
 * conversion between text and the UniversalModel.
 */
export function JsonSchemaEditor(props: {
    value: UniversalModel;
    onChange: (value: UniversalModel) => void;
    readonly?: boolean;
    onError?: (error: string | null) => void;
}) {
    // Instantiate the JSON Schema-specific tools
    const writer = new JsonSchemaWriter();
    const adapter = new JsonSchemaAdapter();
    const parser = new JsonSchemaParser();

    // Debounced handler for when the user types in the editor
    const handleEditorChange = useCallback(
        debounce(async (value: string) => {
            try {
                if (value.trim() === '' || value.trim() === '{}') {
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
                console.error("Error handling JSON Schema editor change:", error);
            }
        }, 500),
        [adapter, parser, props.onChange, props.onError]
    );

    // Local state for the text displayed in the CodeMirror editor
    const [editorValue, setEditorValue] = useState<string>("");

    // Effect to update the editor's text when the universal model prop changes
    useEffect(() => {
        async function updateEditorValue() {
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
            // Use the JSON language extension for syntax highlighting
            extensions={[json()]}
        />
    );
}
