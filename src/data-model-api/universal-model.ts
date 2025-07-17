/**
 * Represents the top-level structure of a universal data model.
 * It can contain entities, relationships, and metadata like id and name.
 */
export interface UniversalModel {
    /**
     * An optional unique identifier for the model.
     */
    id?: string;
    /**
     * An optional name for the model.
     */
    name?: string;
    /**
     * An array of entities that constitute the data model.
     */
    entities: Entity[];
    /**
     * An optional array of relationships between entities in the model.
     */
    relationships?: Relationship[];
}

/**
 * Enum defining the types of relationships between entities.
 */
export enum RelationshipType {
    /**
     * A structural link between two peer entities.
     * Example: A User has a Profile.
     */
    Association = "association",
    /**
     * A strong "whole-part" relationship where the part cannot exist without the whole.
     * If the whole is deleted, the part is also deleted.
     * Example: A House is composed of Rooms.
     */
    Composition = "composition",
    /**
     * A "whole-part" relationship where the part can exist independently of the whole.
     * Example: A Department has Employees.
     */
    Aggregation = "aggregation",
    /**
     * An "is-a" relationship where one entity inherits properties from another.
     * Example: A Dog is an Animal.
     */
    Inheritance = "inheritance",
    /**
     * A relationship where one entity depends on another, but not as a structural part.
     * A change in the independent entity may affect the dependent entity.
     * Example: A Service uses a Logger.
     */
    Dependency = "dependency",
}

/**
 * Represents a relationship between two entities.
 */
export interface Relationship {
    /**
     * The label of the source entity.
     */
    sourceEntityLabel: string;
    /**
     * The label of the target entity.
     */
    targetEntityLabel: string;
    /**
     * The type of relationship.
     */
    type: RelationshipType;
    /**
     * An optional label for the relationship.
     */
    label?: string;
    /**
     * Optional cardinality for the source entity.
     */
    sourceCardinality?: string;
    /**
     * Optional cardinality for the target entity.
     */
    targetCardinality?: string;
}

/**
 * Represents a single entity within the data model (e.g., a class, a table).
 */
export interface Entity {
    /**
     * The unique label or name of the entity.
     */
    label: string;
    /**
     * An optional description for the entity.
     */
    description?: string; // Added to preserve entity descriptions
    /**
     * An array of properties belonging to this entity.
     */
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
    /**
     * The label or name of the property.
     */
    label: string;
    /**
     * The type definition of the property.
     */
    type: Type;
    /**
     * Indicates if the property is required.
     */
    required?: boolean; // Add required property
    /**
     * Optional field to store the actual value or a JSON string of
     * property-level metadata (e.g., access modifiers, annotations).
     */
    value?: any;
}

/**
 * Enum for universal types.
 */
export enum UniversalType {
    /** String type. */
    String = "string",
    /** Number type. */
    Number = "number",
    /** Boolean type. */
    Boolean = "boolean",
    /** Date type. */
    Date = "date",
    /** Datetime type. */
    Datetime = "datetime",
    /** Other type, for unclassified types. */
    Other = "other",
}

/**
 * Enum for universal type formats.
 */
export enum UniversalFormat {
    /** Double precision floating-point number. */
    Double = "double",
    /** 64-bit integer. */
    Long = "long",
    /** Arbitrary precision decimal number. */
    Decimal = "decimal",
    /** Universally unique identifier. */
    Uuid = "uuid",
    /** 8-bit integer. */
    Byte = "byte",
    /** Uniform Resource Identifier. */
    Uri = "uri",
    /** Canonical URI Reference. */
    Curie = "curie",
    /** Time without date. */
    Time = "time",
    /** Email address format. */
    Email = "email",
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
    /**
     * The universal type classification of the property.
     */
    universalType?: UniversalType;
    /**
     * The specific format of the universal type, if applicable.
     */
    format?: UniversalFormat;
}
