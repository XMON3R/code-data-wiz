//import { csharpEditor } from "./csharp/csharp-editor";
import { sqlEditor } from "./sql-vocabulary/sql-editor";
import { EditorType } from "./plugins-codelist";
import { mockEditor } from "./mockEditor";
import { PlantUmlEditor } from "./plant-uml/plant-uml-editor";
import { LinkmlEditor } from "./linkml/linkml-editor";
import { JsonSchemaEditor } from "./json-schema/json-schema-editor";

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
        case EditorType.SQLQuery:
            return sqlEditor;
        case EditorType.LinkML:
            return LinkmlEditor;
        case EditorType.JsonSchema:
            return JsonSchemaEditor;
        case EditorType.PlantUML:
            return PlantUmlEditor;
        default:
            throw new Error(`Unknown editor type: ${type}`);
    }
}
