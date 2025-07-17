import { DomainSpecificModel } from "../../data-model-api/domain-specific-model-api";

/**
 * Represents a LinkML schema.
 * This is a simplified representation for demonstration purposes.
 * A full LinkML model would be much more extensive.
 */
export interface LinkmlModel extends DomainSpecificModel {
  schema: LinkmlSchema;
}

export interface LinkmlSchema {
  id?: string;
  name?: string;
  description?: string;
  default_range?: string; // Add default_range to LinkmlSchema
  classes?: { [key: string]: LinkmlClassDefinition };
  slots?: { [key: string]: LinkmlSlotDefinition };
  types?: { [key: string]: LinkmlTypeDefinition };
  enums?: { [key: string]: LinkmlEnumDefinition };
  // Add other top-level LinkML schema elements as needed
}

export interface LinkmlClassDefinition {
  description?: string;
  slots?: string[]; // References to slot names defined at the schema level
  attributes?: { [key: string]: LinkmlSlotDefinition }; // Slots defined directly within the class
  is_a?: string; // Parent class
  mixins?: string[];
  // Add other class-specific properties
}

export interface LinkmlSlotDefinition {
  description?: string;
  range?: string; // The type of the slot (e.g., "string", "integer", or a class name)
  multivalued?: boolean;
  required?: boolean;
  // Add other slot-specific properties like 'pattern', 'minimum_value', 'maximum_value'
}

export interface LinkmlTypeDefinition {
  description?: string;
  typeof?: string; // Base type (e.g., "string", "integer")
  // Add other type-specific properties like 'pattern', 'minimum_value'
}

export interface LinkmlEnumDefinition {
  description?: string;
  permissible_values?: { [key: string]: LinkmlPermissibleValue };
}

export interface LinkmlPermissibleValue {
  description?: string;
  // Add other permissible value properties
}
