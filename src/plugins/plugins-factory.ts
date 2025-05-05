import { csharpEditor } from "./csharp/csharp-editor";
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
            // return sqlEditor; // Uncomment and implement this when SQL editor is available
            throw new Error("SQL editor not implemented yet.");
        default:
            throw new Error(`Unknown editor type: ${type}`);
    }
}


