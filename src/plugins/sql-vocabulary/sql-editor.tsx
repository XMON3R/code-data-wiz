import { sql } from "@codemirror/lang-sql";
import { UniversalModel } from "../../data-model-api";
import { useCallback, useEffect, useState } from "react";
import { CodeMirrorEditor } from "../components/code-mirror-editor";
import { debounce } from "../../application/components/debounce";
import { SqlAdapter } from "./sql-adapter";
import SimpleSQLParser from "./sql-parser";
import { SimpleSQLWriter } from "./sql-writer";

export function sqlEditor(props: {
    value: UniversalModel;
    onChange: (value: UniversalModel) => void;
    readonly?: boolean;
    onError?: (error: string | null) => void;
}) {
    const writer = new SimpleSQLWriter();
    const adapter = new SqlAdapter();
    const reader = new SimpleSQLParser();

    const handleEditorChange = useCallback(
        debounce(async (value: string) => {
            try {
                const domainModel = reader.parse(value);
                if (domainModel.tables.length > 0 || value.trim() === '') {
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
            const domainModel = await adapter.fromUniversalModel(props.value);
            const stringValue = writer.generateCode(domainModel);
            setEditorValue(stringValue);
        }
        updateEditorValue();
    }, [props.value, adapter, writer]);


    return (
        <CodeMirrorEditor
            value={editorValue}
            onChange={handleEditorChange}
            readOnly={props.readonly}
            extensions={[sql()]}
        />
    );
}
