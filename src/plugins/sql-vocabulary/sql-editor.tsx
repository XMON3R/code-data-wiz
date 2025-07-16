import { sql } from "@codemirror/lang-sql";
import { UniversalModel } from "../../data-model-api";
import { useEffect, useState, useMemo } from "react";
import { CodeMirrorEditor } from "../components/code-mirror-editor";
import { debounce } from "../../application/components/debounce";
import { SqlAdapter } from "./sql-adapter";
import SimpleSQLParser from "./sql-parser";
import { SimpleSQLWriter } from "./sql-writer";

/**
 * An editor component for SQL
 */
export function SqlEditor(props: {
    value: UniversalModel;
    onChange: (value: UniversalModel) => void;
    isReadOnly?: boolean;
    onError?: (error: string | null) => void;
}) {
    const writer = useMemo(() => new SimpleSQLWriter(), []);
    const adapter = useMemo(() => new SqlAdapter(), []);
    const reader = useMemo(() => new SimpleSQLParser(), []);

    const handleEditorChange = useMemo(
        () =>
            debounce(async (value: string) => {
                try {
                    const domainModel = reader.parse(value);
                    if (domainModel.tables.length > 0 || value.trim() === "") {
                        const newUniversalModel = await adapter.toUniversalModel(domainModel);
                        props.onError?.(null);
                        props.onChange(newUniversalModel);
                    }
                } catch (e) {
                    const error = e as Error;
                    props.onError?.(error.message);
                    console.error("Error handling editor change:", error);
                }
            }, 500),
        [adapter, reader, props.onChange, props.onError]
    );

    const [editorValue, setEditorValue] = useState<string>("");

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

    return (
        <CodeMirrorEditor
            value={editorValue}
            onChange={handleEditorChange}
            readOnly={props.isReadOnly}
            extensions={[sql()]}
        />
    );
}