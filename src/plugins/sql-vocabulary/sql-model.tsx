export interface SQLTable {
    name: string;
    columns: SQLColumn[];
  }
  
  export interface SQLColumn {
    name: string;
    type: SQLDataType;
  }
  
  export type SQLDataType = 'INT' | 'VARCHAR(255)' | 'DECIMAL(10, 2)' | 'TEXT';
  
  export interface SQLDiagram {
    tables: SQLTable[];
  }