import { json } from "@codemirror/lang-json";
import { UniversalModel } from "../../data-model-api";
import { useCallback, useEffect, useState } from "react";
import { CodeMirrorEditor } from "../components/code-mirror-editor";
import { debounce } from "../../application/components/debounce";
import { JsonSchemaAdapter } from "./json-schema-adapter";
import { JsonSchemaParser } from "./json-schema-parser";
import { JsonSchemaWriter } from "./json-schema-writer";

/**
 * Props for the JsonSchemaEditor component.
 */
interface JsonSchemaEditorProps {
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
 * An editor component for JSON Schema that handles the full round-trip
 * conversion between text and the UniversalModel.
 * @param props The props for the JsonSchemaEditor component.
 */
export function JsonSchemaEditor(props: JsonSchemaEditorProps) {
    // Instantiate the JSON Schema-specific tools
    const writer = new JsonSchemaWriter();
    const adapter = new JsonSchemaAdapter();
    const parser = new JsonSchemaParser();

    /**
     * Debounced handler for when the user types in the editor.
     * It parses the JSON Schema text and propagates the change to the UniversalModel.
     */
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
            if (props.isReadOnly) {
                if (props.value && props.value.entities.length > 0) {
                    const domainModel = await adapter.fromUniversalModel(props.value);
                    const stringValue = await writer.writeText(domainModel);
                    setEditorValue(stringValue);
                } else {
                    setEditorValue("");
                }
            }
        }
        updateEditorValue();
    }, [props.value, adapter, writer, props.isReadOnly]);


    return (
        <CodeMirrorEditor
            value={editorValue}
            onChange={handleEditorChange}
            readOnly={props.isReadOnly}
            // Use the JSON language extension for syntax highlighting
            extensions={[json()]}
        />
    );
}
