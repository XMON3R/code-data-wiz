
export interface SQLDiagram {
  tables: SQLTable[];
}

// TODO
/*export interface SQLDatabase {
  tables: SQLTable[];
}*/

export interface SQLTable {
    name: string;
    columns: SQLColumn[];
  }
  
export interface SQLColumn {
    name: string;
    type: SQLDataType;
  }

export interface SQLParamaterDataType {
  type: SQLDataType;
  
  size: int;

}
  
export type SQLDataType = 'INT' | 'VARCHAR(255)' | 'DECIMAL(10, 2)' | 'TEXT';
  
  