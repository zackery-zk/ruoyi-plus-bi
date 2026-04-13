import type { DataTypeEnum } from '@vben/constants';

export interface ColumnInfo {
  name: string;
  alias: string;
  dataType: string;
}

export interface QueryResult {
  //查询Id
  queryId: string;
  //列头
  columns: ColumnInfo[];
  //数据
  rows: Record<string, any>[];
  //总行数
  total: number;
  //每页数量
  pageSize: number;
  //当前页码
  pageNum: number;
  //执行时间
  executeTime: number;
}

export interface OutputFieldInfo {
  /** 字段名 */
  fieldName: string;

  /** 字段别名 */
  fieldAlias: string;

  /** 数据类型 */
  dataType: DataTypeEnum;

  /** 数据格式ID，为空则使用默认格式 */
  dataFormat: number | string;

  /** 转换规则ID */
  transformRule: number | string;

  /** 脱敏规则ID */
  maskRule: number | string;
}
