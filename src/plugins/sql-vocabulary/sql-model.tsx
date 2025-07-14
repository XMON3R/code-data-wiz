/**
 * {@link https://dev.mysql.com/doc/}
 */

import { DomainSpecificModel } from "../../data-model-api/domain-specific-model";

export interface SQLDiagram extends DomainSpecificModel {
  tables: SQLTable[];
}

export interface SQLTable {
    name: string;
    columns: SQLColumn[];
    // possible constraints, indexes, etc.
    constraints?: SQLConstraint[];
}
 
export interface SQLColumn {
    name: string;
    type: SQLDataType;
    // Properties like nullable, default value, etc
    isNullable?: boolean;
    defaultValue?: string | number | boolean | null;
    // isPrimaryKey?: boolean;
}

export interface SQLConstraint {
  type: 'PRIMARY KEY' | 'FOREIGN KEY' | 'UNIQUE';
  name?: string; // e.g., FK_Orders_Employees
  columns: string[];
  references?: { // Only for FOREIGN KEY
    table: string;
    columns: string[];
  }
}

/**
 * This separates the type name from its parameters.
 */
export interface SQLDataType {
  /**
   * The name of the data type, e.g., "INT", "VARCHAR", "DECIMAL".
   */
  name: string;
  /**
   * An optional array of parameters for the given type.
   * For VARCHAR(255), this would be [255].
   * For DECIMAL(10, 2), this would be [10, 2].
   */
  parameters?: (string | number)[];
}
