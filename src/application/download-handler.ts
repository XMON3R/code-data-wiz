import { useState, useCallback } from "react";
import { UniversalModel } from "../data-model-api/index.ts";
import { EditorType } from "../plugins/index.ts";
import { encode } from 'plantuml-encoder';
import { universalModelToPlantUml } from '../plugins/plant-uml/plant-uml-editor.tsx'; 
import { SqlAdapter } from '../plugins/sql-vocabulary/sql-adapter.ts';
import { SQLDiagram } from '../plugins/sql-vocabulary/sql-model';
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

// Function to generate SQL string from SQLDiagram
const generateSqlString = (sqlDiagram: SQLDiagram): string => {
    if (!sqlDiagram || !sqlDiagram.tables) {
        return "-- No SQL diagram data available";
    }

    const sqlStatements: string[] = [];

    sqlDiagram.tables.forEach((table) => {
        const columns: string[] = [];
        table.columns.forEach((column) => {
            let columnDefinition = `    ${column.name} ${column.type.name}`;
            if (column.type.parameters && column.type.parameters.length > 0) {
                columnDefinition += `(${column.type.parameters.join(", ")})`;
            }
            if (column.isNullable === false) { // Explicitly check for false, as undefined might mean nullable
                columnDefinition += " NOT NULL";
            }
            if (column.defaultValue !== undefined) {
                // Handle string defaults by quoting them
                const defaultValue = typeof column.defaultValue === 'string' ? `'${column.defaultValue}'` : column.defaultValue;
                columnDefinition += ` DEFAULT ${defaultValue}`;
            }
            columns.push(columnDefinition);
        });

        // Basic constraint handling (e.g., Primary Key) - can be expanded
        // For simplicity, we'll assume primary keys are handled within column definitions if possible,
        // or we'd need to parse constraints from entity.value if they were stored there.
        // The SqlAdapter stores constraints in the `constraints` property of the table.
        const tableConstraints = table.constraints || [];

        // Add primary key constraint if defined
        const primaryKeyConstraint = tableConstraints.find(c => c.type === 'PRIMARY KEY');
        if (primaryKeyConstraint && primaryKeyConstraint.columns) {
            columns.push(`    PRIMARY KEY (${primaryKeyConstraint.columns.join(", ")})`);
        }

        // Add foreign key constraints
        tableConstraints.filter(c => c.type === 'FOREIGN KEY').forEach(fkConstraint => {
            if (fkConstraint.columns && fkConstraint.references) {
                columns.push(`    FOREIGN KEY (${fkConstraint.columns.join(", ")}) REFERENCES ${fkConstraint.references.table}(${fkConstraint.references.columns.join(", ")})`);
            }
        });

        const createTableStatement = `CREATE TABLE ${table.name} (\n${columns.join(",\n")}\n);`;
        sqlStatements.push(createTableStatement);
    });

    return sqlStatements.join("\n\n");
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
                        fileContent = generateSqlString(sqlDiagram); // Use the new function to generate SQL string
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
