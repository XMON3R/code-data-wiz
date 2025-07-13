import { java } from "@codemirror/lang-java";
import { UniversalModel } from "../../data-model-api";
import { useCallback, useEffect, useState } from "react";
import { CodeMirrorEditor } from "../components/code-mirror-editor";
import { debounce } from "../../application/components/debounce";
import { JavaParser } from "./java-parser";
import { JavaWriter } from "./java-writer";
import { JavaAdapter } from "./java-adapter"; // Assuming a basic adapter exists


/**
 * An editor component for Java that handles the full round-trip
 * conversion between text and the UniversalModel.
 */


export function JavaEditor(props: {
    value: UniversalModel;
    onChange: (value: UniversalModel) => void;
    readonly?: boolean;
    onError?: (error: string | null) => void;
}) {
    const writer = new JavaWriter();
    const adapter = new JavaAdapter();
    const parser = new JavaParser();

    const handleEditorChange = useCallback(
        debounce(async (value: string) => {
            try {
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
                console.error("Error handling Java editor change:", error);
            }
        }, 500),
        [] 
    );

    const [editorValue, setEditorValue] = useState<string>("");

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
    }, [props.value]);


    return (
        <CodeMirrorEditor
            value={editorValue}
            onChange={handleEditorChange}
            readOnly={props.readonly}
            extensions={[java()]}
        />
    );
}
