import { Extension } from '@codemirror/state';
import { createEditor } from '../../plugins/plugins-factory';
import { EditorType } from '../../plugins';
import { EditorHeader } from './editor-header'; // Make sure this import is correct
import { UniversalModel } from '../../data-model-api';

// Interface setting up the editor shown in UI
export interface EditorProps {
  value: UniversalModel; // Change to UniversalModel
  onChange?: (value: UniversalModel) => void; // Change to UniversalModel
  readOnly?: boolean;
  extensions?: Extension[];
  className?: string;
  type: EditorType;
  onChangeType: (value: EditorType) => void;
}

interface EditorWrapProps {
  type: EditorType;
  value: UniversalModel; // Change to UniversalModel
  onChange?: (value: UniversalModel) => void; // Change to UniversalModel
  readOnly?: boolean;
}

// Implementation of CodeMirror component for better visuals and formatting
// add /*, extensions */
export function Editor({ value, onChange, readOnly, className, type, onChangeType }: EditorProps) {
    return (
        <div className={`h-full flex-1 grow-0 ${className}`}>
            <EditorHeader
                className="h-10"
                type={type}  // Pass the type prop
                onChangeType={onChangeType} // Pass the onChangeType prop
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
            value={value} // Pass UniversalModel directly
            onChange={onChange || (() => {})} // Provide a default no-op function
            readonly={readOnly}
        />
    );
}