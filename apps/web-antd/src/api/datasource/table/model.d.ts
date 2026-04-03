export interface BasicTable {
  /**
   * 数据表ID
   */
  tableId: number | string;

  /**
   * 数据源ID
   */
  dsId: number | string;

  /**
   * 模式
   */
  schemaName: string;

  /**
   * 模式
   */
  schemaId: number | string;

  /**
   * 表名称
   */
  tableName: string;

  /**
   * 表别名
   */
  tableAlias: string;

  /**
   * 表类型
   */
  tableType:string;

  /**
   * 表描述
   */
  tableDesc: string;


  /**
   * 扩展字段
   */
  extended: string;
}
