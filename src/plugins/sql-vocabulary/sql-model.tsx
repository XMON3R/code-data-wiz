/**
 * A base interface for domain-specific models.
 */
export interface DomainSpecificModel {}

/**
 * Represents a full SQL diagram, containing multiple tables.
 */
export interface SQLDiagram extends DomainSpecificModel {
 tables: SQLTable[];
}

/**
 * Represents a single SQL table with its name, columns, and constraints.
 */
export interface SQLTable {
 name: string;
 columns: SQLColumn[];
 constraints?: SQLConstraint[];
}

/**
 * Represents a single column within a SQL table.
 */
export interface SQLColumn {
 name: string;
 type: SQLDataType;
 isNullable?: boolean;
 defaultValue?: string | number | boolean | null;
}

/**
 * Represents a constraint on a SQL table (e.g., PRIMARY KEY, FOREIGN KEY).
 */
export interface SQLConstraint {
 type: 'PRIMARY KEY' | 'FOREIGN KEY' | 'UNIQUE';
 name?: string;
 columns: string[];
 references?: {
  table: string;
  columns: string[];
 };
}

/**
 * Represents the data type of a SQL column, including its name and any parameters.
 */
export interface SQLDataType {
 name: string;
 parameters?: (string | number)[];
}
