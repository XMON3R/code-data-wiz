import { useState, useCallback } from "react";
import { UniversalModel } from "../data-model-api/index.ts";
import { EditorType } from "../plugins/index.ts";
import { encode } from 'plantuml-encoder';
import { universalModelToPlantUml } from '../plugins/plant-uml/plant-uml-editor.tsx'; 
import { SqlAdapter } from '../plugins/sql-vocabulary/sql-adapter.ts';
import { JavaAdapter } from '../plugins/java/java-adapter.ts';
import { JavaWriter } from '../plugins/java/java-writer.ts';
import { CSharpAdapter } from '../plugins/csharp/csharp-adapter.ts';
import { SimpleCSharpWriter } from '../plugins/csharp/csharp-writer.ts';
import { LinkmlAdapter } from '../plugins/linkml/linkml-adapter.ts';
import { LinkmlWriter } from '../plugins/linkml/linkml-writer.ts';
import { JsonSchemaAdapter } from '../plugins/json-schema/json-schema-adapter.ts';
import { JsonSchemaWriter } from '../plugins/json-schema/json-schema-writer.ts';

// Function to determine file extension based on EditorType
const getFileExtension = (type: EditorType): string => {
    switch (type) {
        case EditorType.SQLQuery:
            return ".sql";
        case EditorType.Java:
            return ".java";
        case EditorType.Csharp:
            return ".cs";
        case EditorType.LinkML:
            return ".yaml";
        case EditorType.JsonSchema:
            return ".json";
        case EditorType.PlantUML:
            return ".txt"; 
        default:
            return ".txt"; 
    }
};

export const useDownloadHandler = () => {
    const [downloadError, setDownloadError] = useState<string | null>(null);

    const handleDownload = useCallback(async (content: UniversalModel, type: EditorType) => {
        setDownloadError(null); // Reset error on new download attempt
        const fileExtension = getFileExtension(type);
        const fileName = `editor-content${fileExtension}`;

        if (type === EditorType.PlantUML) {
            try {
                // Use the imported function
                const plantUmlCode = universalModelToPlantUml(content as UniversalModel); // Cast content to UniversalModel
                const encodedPlantUml = encode(plantUmlCode);
                const imageUrl = `http://www.plantuml.com/plantuml/jpg/${encodedPlantUml}`; // Use JPG endpoint

                // Instead of fetching the image, we download the URL as text
                const fileContent = imageUrl; // The content to download is the URL itself

                const blob = new Blob([fileContent], { type: "text/plain" }); 
                const url = URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = url;
                a.download = `plantuml_image_url.txt`; 
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

            } catch (e) {
                console.error("Error downloading PlantUML image URL:", e);
                setDownloadError("Failed to download PlantUML image URL.");
            }
        } else {
            let fileContent: string;
            switch (type) {
                case EditorType.SQLQuery:
                    try {
                        const sqlAdapter = new SqlAdapter();
                        const sqlDiagram = await sqlAdapter.fromUniversalModel(content);
                        fileContent = JSON.stringify(sqlDiagram, null, 2); // Stringify the SQLDiagram
                    } catch (e) {
                        console.error("Error converting UniversalModel to SQLDiagram:", e);
                        setDownloadError("Failed to convert to SQL format.");
                        return; // Exit if conversion fails
                    }
                    break;
                case EditorType.Java:
                    try {
                        const javaAdapter = new JavaAdapter();
                        const javaModel = await javaAdapter.fromUniversalModel(content);
                        const javaWriter = new JavaWriter();
                        fileContent = await javaWriter.writeText(javaModel);
                    } catch (e) {
                        console.error("Error converting UniversalModel to Java:", e);
                        setDownloadError("Failed to convert to Java format.");
                        return; // Exit if conversion fails
                    }
                    break;
                case EditorType.Csharp:
                    try {
                        const csharpAdapter = new CSharpAdapter();
                        const csharpModel = await csharpAdapter.fromUniversalModel(content);
                        const csharpWriter = new SimpleCSharpWriter();
                        fileContent = csharpWriter.generateCode(csharpModel);
                    } catch (e) {
                        console.error("Error converting UniversalModel to C#:", e);
                        setDownloadError("Failed to convert to C# format.");
                        return; // Exit if conversion fails
                    }
                    break;
                case EditorType.LinkML:
                    try {
                        const linkmlAdapter = new LinkmlAdapter();
                        const linkmlModel = await linkmlAdapter.fromUniversalModel(content);
                        const linkmlWriter = new LinkmlWriter();
                        fileContent = await linkmlWriter.writeText(linkmlModel);
                    } catch (e) {
                        console.error("Error converting UniversalModel to LinkML:", e);
                        setDownloadError("Failed to convert to LinkML format.");
                        return; // Exit if conversion fails
                    }
                    break;
                case EditorType.JsonSchema:
                    try {
                        const jsonSchemaAdapter = new JsonSchemaAdapter();
                        const jsonSchemaModel = await jsonSchemaAdapter.fromUniversalModel(content);
                        const jsonSchemaWriter = new JsonSchemaWriter();
                        fileContent = await jsonSchemaWriter.writeText(jsonSchemaModel);
                    } catch (e) {
                        console.error("Error converting UniversalModel to JSON Schema:", e);
                        setDownloadError("Failed to convert to JSON Schema format.");
                        return; // Exit if conversion fails
                    }
                    break;
                default:
                    // For other types, stringify the UniversalModel directly
                    fileContent = JSON.stringify(content, null, 2);
            }
            
            const blob = new Blob([fileContent], { type: "text/plain" }); 
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }, []); 

    return { handleDownload, downloadError };
};
