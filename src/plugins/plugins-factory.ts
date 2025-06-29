//import { csharpEditor } from "./csharp/csharp-editor";
import { sqlEditor } from "./sql-vocabulary/sql-editor";
import { EditorType } from "./plugins-codelist";
import { mockEditor } from "./mockEditor";

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
            return mockEditor;
        case EditorType.SecondaryEditor:
            return mockEditor
        case EditorType.SQLQuery:
            return sqlEditor;
        default:
            throw new Error(`Unknown editor type: ${type}`);
    }
}
