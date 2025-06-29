//import { csharpEditor } from "./csharp/csharp-editor";
import { sqlEditor } from "./sql-vocabulary/sql-editor";
import { EditorType } from "./plugins-codelist";
import { mockEditor } from "./mockEditor";
import { PlantUmlEditor } from "./plant-uml/plant-uml-editor";

export function listPluginMetadata() {
    return [
        {
            type: EditorType.ClassDiagram,
            label: "",
            description: "",
            name: "Class Diagram",
        },
        {
            type: EditorType.PlantUML,
            label: "PlantUML",
            description: "PlantUML Diagram Editor",
            name: "PlantUML Diagram",
        }
    ];
}



export function createEditor(type: EditorType) {
    switch (type) {
        case EditorType.ClassDiagram:
            return mockEditor;
        case EditorType.SecondaryEditor:
            return mockEditor
        case EditorType.SQLQuery:
            return sqlEditor;
        case EditorType.PlantUML:
            return PlantUmlEditor;
        default:
            throw new Error(`Unknown editor type: ${type}`);
    }
}
