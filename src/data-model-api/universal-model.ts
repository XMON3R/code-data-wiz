/**
 * Represents a single parameter of a method.
 */
export interface MethodParameter {
    name: string;
    type: Type;
}

/**
 * Represents a method or function within an entity.
 */
export interface Method {
    label: string;
    returnType: Type;
    parameters: MethodParameter[];
    value?: any; // For storing metadata like access modifiers, static, async, etc.
}

/**
 * Represents a single entity within the data model (e.g., a class, a table).
 */
export interface Entity {
    label: string;
    description?: string;
    properties: Property[];
    // --- FIX IS HERE ---
    // Methods are now a distinct, optional part of an entity.
    methods?: Method[];
    value?: any;
}

/**
 * Represents a property of an entity (e.g., a column, a field).
 */
export interface Property {
    label: string;
    type: Type;
    value?: any;
}

/**
 * The base interface for all type representations.
 */
export interface Type {
    domainSpecificType: string;
    universalType?: "string" | "number" | "boolean" | "date" | "datetime" | "other";
    format?: string;
}

/**
 * The top-level interface representing the entire data-model.
 */
export interface UniversalModel {
    entities: Entity[];
    relationships?: any[]; // Placeholder for future relationship modeling
}
