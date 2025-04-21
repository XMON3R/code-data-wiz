import { csharpEditor } from "./csharp-vocabulary/csharp-editor";
import { EditorType } from "./plugins-codelist";

export function listPluginMetadata() {
    return {
        type: EditorType.ClassDiagram,
        label: "",
        description: "",
        name: 'Class Diagram',
    };
}

export function createEditor(type: EditorType) {
    switch (type) {
        case EditorType.ClassDiagram:
            return csharpEditor;
        default:
            throw new Error(`Unknown editor type: ${type}`);
    }
}