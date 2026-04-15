export interface BasicField {
  /**
   * 字段ID
   */
  fieldId: number | string;

  /**
   * 数据表ID
   */
  tableId: number | string;

  /**
   * 数据表名
   */
  tableName: string;
  /**
   * 字段名称
   */
  fieldName: string;

  /**
   * 字段别名
   */
  fieldAlias: string;

  /**
   * 数据类型
   */
  dataType: string;

  /**
   * 数据格式
   */
  dataFormat: ID;

  /**
   * 字段描述
   */
  fieldDesc: string;

  /**
   * 扩展字段
   */
  extended: string;
}
