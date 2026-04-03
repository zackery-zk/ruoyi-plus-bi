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
