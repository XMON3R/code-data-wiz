/**
 * Enum representing the different supported editor types in the application.
 * Used to switch between various vocabulary representations or notations.
 */
export enum EditorType {
    /** Editor for UniversalModel in dev mode. */
    ClassDiagram = "ClassDiagram",
    
    /** Editor for SQL queries or SQL DDL (data definition language) like CREATE TABLE. */
    SQLQuery = "SQLQuery",

    /** Editor for Java code representation of the model. */
    Java = "Java",

    /** Editor for C# code representation of the model. */
    Csharp = "Csharp",

    /** Editor for LinkML — a modeling language for schemas and ontologies. */
    LinkML = "LinkML",

    /** Editor for JSON Schema — used for defining structure and validation of JSON data. */
    JsonSchema = "JsonSchema",

    /** Editor for PlantUML — a text-based UML diagram generation syntax. */
    PlantUML = "PlantUML",

    /** Editor for OFN (OWL Functional Syntax) — an ontology representation syntax. */
    Ofn = "Ofn"
}
