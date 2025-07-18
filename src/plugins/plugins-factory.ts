// Central registry for all vocabulary editors by type.
// `createEditor` dynamically returns the appropriate editor component,
// and `listPluginMetadata` defines editor metadata (used e.g. in UI dropdowns).

import { SqlEditor } from "./sql-vocabulary/sql-editor";
import { EditorType } from "./plugins-codelist";
import { MockEditor } from "./mockEditor";
import { PlantUmlEditor } from "./plant-uml/plant-uml-editor";
import { LinkmlEditor } from "./linkml/linkml-editor";
import { JsonSchemaEditor } from "./json-schema/json-schema-editor";
import { JavaEditor } from "./java/java-editor";
import { CSharpEditor } from "./csharp/csharp-editor";
import { OfnEditor } from "./ofn-slovnik/ofn-editor";

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
            return MockEditor;
        case EditorType.SQLQuery:
            return SqlEditor;
        case EditorType.Java:
            return JavaEditor;
        case EditorType.Csharp:
            return CSharpEditor;
        case EditorType.LinkML:
            return LinkmlEditor;
        case EditorType.JsonSchema:
            return JsonSchemaEditor;
        case EditorType.PlantUML:
            return PlantUmlEditor;
        case EditorType.Ofn:
            return OfnEditor;
        default:
            throw new Error(`Unknown editor type: ${type}`);
    }
}
