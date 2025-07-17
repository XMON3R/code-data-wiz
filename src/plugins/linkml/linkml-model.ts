import { DomainSpecificModel } from "../../data-model-api/domain-specific-model-api";

/**
 * Represents a LinkML schema.
 * This is a simplified representation for demonstration purposes.
 * A full LinkML model would be much more extensive.
 */
export interface LinkmlModel extends DomainSpecificModel {
  /** The LinkML schema definition. */
  schema: LinkmlSchema;
}

/**
 * Represents the core structure of a LinkML schema.
 */
export interface LinkmlSchema {
  /** The URI identifier for the schema. */
  id?: string;
  /** The name of the schema. */
  name?: string;
  /** A description of the schema. */
  description?: string;
  /** The default range (type) for slots if not explicitly specified. */
  default_range?: string;
  /** A map of class names to their definitions. */
  classes?: { [key: string]: LinkmlClassDefinition };
  /** A map of slot names to their definitions. */
  slots?: { [key: string]: LinkmlSlotDefinition };
  /** A map of type names to their definitions. */
  types?: { [key: string]: LinkmlTypeDefinition };
  /** A map of enum names to their definitions. */
  enums?: { [key: string]: LinkmlEnumDefinition };
  // Add other top-level LinkML schema elements as needed
}

/**
 * Represents a LinkML class definition.
 */
export interface LinkmlClassDefinition {
  /** A description of the class. */
  description?: string;
  /** An array of slot names referenced by this class from the schema's top-level slots. */
  slots?: string[];
  /** A map of attribute names to their slot definitions, defined directly within the class. */
  attributes?: { [key: string]: LinkmlSlotDefinition };
  /** The name of the parent class this class inherits from. */
  is_a?: string;
  /** An array of mixin class names. */
  mixins?: string[];
  // Add other class-specific properties
}

/**
 * Represents a LinkML slot definition (attribute or property).
 */
export interface LinkmlSlotDefinition {
  /** A description of the slot. */
  description?: string;
  /** The range (type) of the slot (e.g., "string", "integer", or a class name). */
  range?: string;
  /** Indicates if the slot can have multiple values. */
  multivalued?: boolean;
  /** Indicates if the slot is required. */
  required?: boolean;
  // Add other slot-specific properties like 'pattern', 'minimum_value', 'maximum_value'
}

/**
 * Represents a LinkML type definition.
 */
export interface LinkmlTypeDefinition {
  /** A description of the type. */
  description?: string;
  /** The base type this type is derived from (e.g., "string", "integer"). */
  typeof?: string;
  // Add other type-specific properties like 'pattern', 'minimum_value'
}

/**
 * Represents a LinkML enumeration definition.
 */
export interface LinkmlEnumDefinition {
  /** A description of the enumeration. */
  description?: string;
  /** A map of permissible value names to their definitions. */
  permissible_values?: { [key: string]: LinkmlPermissibleValue };
}

/**
 * Represents a permissible value within a LinkML enumeration.
 */
export interface LinkmlPermissibleValue {
  /** A description of the permissible value. */
  description?: string;
  // Add other permissible value properties
}
