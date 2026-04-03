export interface JdbcTable {
  tableName: string;
  tableAlias: string;
  tableType: 'Table' | 'View';
  schema: string;
  catalog: string;


  show?:boolean;
  filter?:boolean;
}

export interface JdbcField {
  name: string;
  alias: string;
  jdbcType: string;
  javaType: string;
  comment: string;
  primaryKey: boolean;
  nullable: boolean;
}

export interface SchemaInfo {
  id: string;
  databaseType: any;
  name: string;
}

export interface CatalogInfo {
  id: string;
  databaseType: any;
  name: string;
}

export interface ConnectionInfo {
  catalog: any;
  schema: any;
  dsId: number|string;
}
