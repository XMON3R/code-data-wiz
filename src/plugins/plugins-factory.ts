import { csharpEditor } from "./csharp/csharp-editor";
import { sqlEditor } from "./sql-vocabulary/sql-editor";
import { EditorType } from "./plugins-codelist";

export function listPluginMetadata() {
    return {
        type: EditorType.ClassDiagram,
        label: "",
        description: "",
        name: "Class Diagram",
    };
}



export function createEditor(type: EditorType) {
    switch (type) {
        case EditorType.ClassDiagram:
            return csharpEditor;
        case EditorType.SecondaryEditor:
            return csharpEditor
        case EditorType.SQLQuery:
            return sqlEditor;
        default:
            throw new Error(`Unknown editor type: ${type}`);
    }
}
