/**
 * SQL Domain Model Definitions
 * ----------------------------
 * These interfaces define a simplified abstract representation of SQL schemas,
 * which can be used to parse, manipulate, and serialize SQL-based models.
 * 
 * See: https://www.w3schools.com/sql/sql_datatypes.asp for reference on SQL types.
 */

/**
 * A base interface for domain-specific models (e.g., SQL, OFN).
 */
export interface DomainSpecificModel {}

/**
 * Represents a full SQL diagram (i.e., a database schema) containing multiple tables.
 */
export interface SQLDiagram extends DomainSpecificModel {
  /** List of tables in the SQL diagram */
  tables: SQLTable[];
}

/**
 * Represents a single SQL table with its name, columns, and optional constraints.
 */
export interface SQLTable {
  /** Name of the table */
  name: string;

  /** List of column definitions */
  columns: SQLColumn[];

  /** Optional table-level constraints (e.g. PK, FK, UNIQUE) */
  constraints?: SQLConstraint[];
}

/**
 * Represents a single column within a SQL table.
 */
export interface SQLColumn {
  /** Name of the column */
  name: string;

  /** Data type of the column (e.g. INT, VARCHAR) */
  type: SQLDataType;

  /** Whether the column allows NULL values */
  isNullable?: boolean;

  /** Default value for the column (if any) */
  defaultValue?: string | number | boolean | null;
}

/**
 * Represents a constraint on a SQL table, such as PRIMARY KEY or FOREIGN KEY.
 */
export interface SQLConstraint {
  /** Type of constraint */
  type: 'PRIMARY KEY' | 'FOREIGN KEY' | 'UNIQUE';

  /** Optional name for the constraint */
  name?: string;

  /** List of columns the constraint applies to */
  columns: string[];

  /** If FOREIGN KEY, reference to another table and columns */
  references?: {
    /** Referenced table name */
    table: string;

    /** Referenced columns */
    columns: string[];
  };
}

/**
 * Represents the data type of a SQL column.
 * Examples include: VARCHAR(255), INT, BOOLEAN, etc.
 */
export interface SQLDataType {
  /** Name of the SQL data type (e.g., VARCHAR, INT) */
  name: string;

  /** Optional parameters (e.g., VARCHAR(255) → parameters: [255]) */
  parameters?: (string | number)[];
}
