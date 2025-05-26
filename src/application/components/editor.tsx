import { Extension } from "@codemirror/state";
import { createEditor } from "../../plugins/plugins-factory"; // Assuming this factory creates the CodeMirror component
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

/**
 * Editor component that contains a header and the actual editor content.
 * This component itself is now scrollable, and its header will stick to the top.
 */
export function Editor({ value, onChange, readOnly, className, type, onChangeType }: EditorProps) {
  return (
    // This div is now the scrollable container for the header and content.
    // It takes full height from its parent (VerticalSplitter pane) and handles overflow.
    <div className={`h-full flex flex-col overflow-y-auto relative ${className}`}>
      {/* EditorHeader - now sticky within this scrollable div */}
      <EditorHeader
        className="h-10 flex-shrink-0 z-10 sticky top-0 bg-gray-800"
        type={type}
        onChangeType={onChangeType}
      />
      {/* EditorWrap - takes remaining space and contains the CodeMirror editor */}
      <EditorWrap
        type={type}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
      />
    </div>
  );
}

/**
 * Wrapper for the actual CodeMirror editor component.
 * Ensures the CodeMirror editor itself takes up available space.
 */
function EditorWrap({ type, value, onChange, readOnly }: EditorWrapProps) {
  const EditorComponent = createEditor(type);
  return (
    // This div ensures the CodeMirror component can grow to fill the remaining space.
    // It also sets min-h-0 to prevent flexbox from forcing a scrollbar due to intrinsic content size.
    <div className="flex-1 min-h-0">
      <EditorComponent
        value={value}
        onChange={onChange || (() => {})}
        readonly={readOnly}
      />
    </div>
  );
}
