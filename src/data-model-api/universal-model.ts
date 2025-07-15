/**
 * The top-level interface representing the entire data-model.
 */
export interface UniversalModel {
    entities: Entity[];
    relationships?: Relationship[];
}

/**
 * Represents a relationship between two entities.
 */
export interface Relationship {
    sourceEntityLabel: string;
    targetEntityLabel: string;
    type: "association" | "composition" | "aggregation" | "inheritance" | "dependency";
    label?: string;
    sourceCardinality?: string;
    targetCardinality?: string;
}

/**
 * Represents a single entity within the data model (e.g., a class, a table).
 */
export interface Entity {
    label: string;
    description?: string; // Added to preserve entity descriptions
    properties: Property[];
    /**
     * Optional field to store entity-level metadata, such as the type
     * of a class ('class', 'record') or its access modifier.
     */
    value?: any;
}

/**
 * Represents a property of an entity (e.g., a column, a field).
 */
export interface Property {
    label: string;
    type: Type;
    /**
     * Optional field to store the actual value or a JSON string of
     * property-level metadata (e.g., access modifiers, annotations).
     */
    value?: any;
}

/**
 * The base interface for all type representations.
 */
export interface Type {
    /**
     * A string representation of the original, domain-specific type.
     * e.g., "VARCHAR(255)", "string", "Long"
     */
    domainSpecificType: string;
    universalType?: "string" | "number" | "boolean" | "date" | "datetime" | "other";
    format?: "double" | "long" | "decimal" | "uuid" | "byte" | "uri" | "curie" | "time" | string;
}
