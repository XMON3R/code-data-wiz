import { Extension } from "@codemirror/state";
import { createEditor } from "../../plugins/plugins-factory";
import { EditorType } from "../../plugins";
import { EditorHeader } from "./editor-header"; 
import { UniversalModel } from "../../data-model-api";

// Interface setting up the editor shown in UI
export interface EditorProps {
  value: UniversalModel; 
  onChange?: (value: UniversalModel) => void;
  readOnly?: boolean;
  extensions?: Extension[];
  className?: string;
  type: EditorType;
  onChangeType: (value: EditorType) => void;
}

interface EditorWrapProps {
  type: EditorType;
  value: UniversalModel;
  onChange?: (value: UniversalModel) => void; 
  readOnly?: boolean;
}

// Implementation of CodeMirror component for better visuals and formatting
// add /*, extensions */
export function Editor({ value, onChange, readOnly, className, type, onChangeType }: EditorProps) {
    return (
        <div className={`h-full flex-1 grow-0 ${className}`}>
            <EditorHeader
                className="h-10"
                type={type} 
                onChangeType={onChangeType} 
            />
            <EditorWrap
                type={type}
                value={value}
                onChange={onChange}
                readOnly={readOnly}
            />
        </div>
    );
}

function EditorWrap({ type, value, onChange, readOnly }: EditorWrapProps) {
    const EditorComponent = createEditor(type);
    return (
        <EditorComponent
            value={value} // pass UniversalModel directly?
            onChange={onChange || (() => {})} // default no-op function
            readonly={readOnly}
        />
    );
}