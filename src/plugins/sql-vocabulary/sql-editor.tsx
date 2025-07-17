import { sql } from "@codemirror/lang-sql";
import { UniversalModel } from "../../data-model-api";
import { useEffect, useState, useMemo } from "react";
import { CodeMirrorEditor } from "../components/code-mirror-editor";
import { debounce } from "../../application/components/debounce";
import { SqlAdapter } from "./sql-adapter";
import SimpleSQLParser from "./sql-parser";
import { SimpleSQLWriter } from "./sql-writer";

/**
 * SqlEditor Component
 * -------------------
 * This component provides a CodeMirror editor tailored for SQL syntax.
 */
export function SqlEditor(props: {
    value: UniversalModel;                       // Universal model input
    onChange: (value: UniversalModel) => void;   // Called with new model after parsing
    isReadOnly?: boolean;                        // Whether the editor is read-only
    onError?: (error: string | null) => void;    // Callback for reporting parsing errors
}) {
    // Instantiate code generation and parsing tools with useMemo for reuse
    const writer = useMemo(() => new SimpleSQLWriter(), []);
    const adapter = useMemo(() => new SqlAdapter(), []);
    const reader = useMemo(() => new SimpleSQLParser(), []);

    /**
     * Debounced handler for editor changes
     * - Parses SQL string to domain model
     * - Converts to universal model
     * - Notifies parent via onChange
     * - Catches and forwards any parsing error to onError
     */
    const handleEditorChange = useMemo(
        () =>
            debounce(async (value: string) => {
                try {
                    const domainModel = reader.parse(value);
                    if (domainModel.tables.length > 0 || value.trim() === "") {
                        const newUniversalModel = await adapter.toUniversalModel(domainModel);
                        props.onError?.(null); // Clear errors
                        props.onChange(newUniversalModel);
                    }
                } catch (e) {
                    const error = e as Error;
                    props.onError?.(error.message); // Report parse error
                    console.error("Error handling editor change:", error);
                }
            }, 500), // 500ms debounce delay
        [adapter, reader, props.onChange, props.onError]
    );

    // Local state for the actual SQL string shown in the editor
    const [editorValue, setEditorValue] = useState<string>("");

    /**
     * If in read-only mode, update editorValue to reflect the current UniversalModel
     * Converts it to a SQLDiagram and then serializes it as raw SQL string
     */
    useEffect(() => {
        async function updateEditorValue() {
            if (props.isReadOnly) {
                const domainModel = await adapter.fromUniversalModel(props.value);
                const stringValue = writer.generateCode(domainModel);
                setEditorValue(stringValue);
            }
        }
        updateEditorValue();
    }, [props.value, adapter, writer, props.isReadOnly]);

    // Render CodeMirrorEditor configured for SQL with current value and handlers
    return (
        <CodeMirrorEditor
            value={editorValue}
            onChange={handleEditorChange}
            readOnly={props.isReadOnly}
            extensions={[sql()]} // Enable SQL syntax highlighting
        />
    );
}
