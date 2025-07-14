import { useState, useCallback } from "react";
import { UniversalModel } from "../data-model-api/index.ts";
import { EditorType } from "../plugins/index.ts";
import { encode } from 'plantuml-encoder';
import { universalModelToPlantUml } from '../plugins/plant-uml/plant-uml-editor.tsx'; 

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
            const fileContent = JSON.stringify(content, null, 2);
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
