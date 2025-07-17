// src/dev-tools/MockEditor.tsx

/**
 * A development-only editor for viewing and editing the UniversalModel as formatted JSON.
 *
 * This editor is shown when the app is run with the `?dev` query parameter.
 * It allows inspection and live editing of the UniversalModel for development and debugging purposes.
 */

import { useEffect, useState } from "react";
import { CodeMirrorEditor } from "./components/code-mirror-editor";
import { UniversalModel } from "../data-model-api";

export function MockEditor(props: {
  value: UniversalModel;
  onChange: (value: UniversalModel) => void;
  readonly?: boolean;
  onError?: (error: string | null) => void;
  isRightEditor?: boolean;
}) {
  const [editorValue, setEditorValue] = useState<string>(() =>
    JSON.stringify(props.value, null, 2)
  );

  useEffect(() => {
    if (props.isRightEditor) {
      setEditorValue(JSON.stringify(props.value, null, 2));
    }
  }, [props.value, props.isRightEditor]);

  const handleEditorChange = (value: string) => {
    if (!props.isRightEditor) {
      setEditorValue(value);
    }

    try {
      const parsed = JSON.parse(value);
      props.onError?.(null);
      props.onChange(parsed);
    } catch (e) {
      const error = e as Error;
      props.onError?.(error.message);
      console.error("Error parsing JSON:", error);
    }
  };

  const isReadOnly = props.isRightEditor || props.readonly;

  return (
    <CodeMirrorEditor
      value={editorValue}
      onChange={handleEditorChange}
      readOnly={isReadOnly}
    />
  );
}
