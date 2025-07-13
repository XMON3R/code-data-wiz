import { Extension } from "@codemirror/state";
import { createEditor } from "../../plugins/plugins-factory";
import { EditorType } from "../../plugins";
import { EditorHeader } from "./editor-header";
import { UniversalModel } from "../../data-model-api";

// Interface setting up the editor shown in UI
export interface EditorProps {
  value: UniversalModel;
  onChange?: (value: UniversalModel) => void; // This onChange is now only for the left editor
  readOnly?: boolean;
  extensions?: Extension[];
  className?: string;
  type: EditorType;
  onChangeType: (value: EditorType) => void;
  onError?: (error: string | null) => void;
  error?: string | null;
  isRightEditor?: boolean;
  // These props are now only relevant for the right editor, but Editor still needs to accept them
  autoRefresh?: boolean;
  onToggleAutoRefresh?: (autoRefresh: boolean) => void;
  onTranslateClick?: () => void;
}

/**
 * Editor component that contains a header and the actual editor content.
 * This component itself is now scrollable, and its header will stick to the top.
 */
export function Editor({ value, onChange, readOnly, className, type, onChangeType, error, onError, isRightEditor, autoRefresh, onToggleAutoRefresh, onTranslateClick }: EditorProps) {

  return (
    <div className={`h-full flex flex-col overflow-y-auto relative ${className}`}>
      {/* EditorHeader - now sticky within this scrollable div */}
      <EditorHeader
        className="h-10 flex-shrink-0 z-10 sticky top-0 bg-gray-800"
        type={type}
        onChangeType={onChangeType}
        isRightEditor={isRightEditor}
        autoRefresh={autoRefresh || false} // Default to false if not provided (for left editor)
        onToggleAutoRefresh={onToggleAutoRefresh || (() => {})}
        onTranslateClick={onTranslateClick || (() => {})}
      />
      {/* EditorWrap - takes remaining space and contains the CodeMirror editor */}
      {error ? (
        <div className="p-4 text-red-500">{error}</div>
      ) : (
        <EditorWrap
          type={type}
          value={value} // EditorWrap now directly uses the 'value' prop from Editor
          onChange={onChange} // This onChange is only for the left editor
          readOnly={readOnly}
          onChangeType={onChangeType}
          onError={onError}
          isRightEditor={isRightEditor}
        />
      )}
    </div>
  );
}

/**
 * Wrapper for the actual CodeMirror editor component.
 * Ensures the CodeMirror editor itself takes up available space.
 */
function EditorWrap({ type, value, onChange, readOnly, onChangeType, onError, isRightEditor }: EditorProps) {
  if (!onChangeType) {
    throw new Error("onChangeType is required for EditorWrap");
  }
  const EditorComponent = createEditor(type);
  return (
    <div className="flex-1 min-h-0">
      <EditorComponent
        value={value}
        onChange={onChange || (() => {})}
        readonly={readOnly}
        onError={onError}
        isRightEditor={isRightEditor}
      />
    </div>
  );
}
