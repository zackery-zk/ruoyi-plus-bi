// 数据库分类
export enum DataBaseCategoryEnum {
  Embedded = 'Embedded',
  File = 'File',
  Interface = 'Interface',
  Relational = 'Relational',
}
// 数据源认证类型
export enum AuthTypeEnum {
  NONE = 'NONE',
  PASSWORD = 'PASSWORD'
}

// 数据库类型
export enum DataBaseTypeEnum {
  DuckDB = 'DUCKDB',
  Excel = 'EXCEL',
  MySql = 'MYSQL',
  Oracle = 'ORACLE',
  Rest = 'REST',
  WebService = 'WEBSERVICE',
}
// 认证类型
export const AUTH_TYPE_OPTION:any[] = [
  {
    label: '无身份认证',
    value: 'NONE'
  },
  {
    label: '用户名密码',
    value: 'PASSWORD'
  }
]  as const;

// 事务隔离级别
export const TRANSACTION_ISOLATION_LEVEL_OPTION:any[] = [
  {
    label: 'JDBC默认值',
    value: 'JDBC'
  },
  {
    label: '关闭事务',
    value: 'CLOSE_TRANSACTION'
  },
  {
    label: '脏数据读',
    value: 'DIRTY_READ'
  },
  {
    label: '防止脏数据读',
    value: 'PREVENT_DIRTY_READ'
  },
  {
    label: '可重复读',
    value: 'REPEATABLE_READ'
  },
  {
    label: '串行',
    value: 'SERIALIZABLE'
  }
]  as const;

// 列别名来源
export const COLUMN_ALIAS_SOURCE_OPTION:any[] = [
  {
    label: '无别名',
    value: 'NONE'
  },
  {
    label: '列别名',
    value: 'COLUMN_ALIAS'
  },
  {
    label: '列描述',
    value: 'COLUMN_DESC'
  }
]  as const;

// 校验语句类型
export const VALIDATE_STATEMENT_TYPE_OPTION:any[] = [
  {
    label: '获取连接时测试',
    value: 'GET_CONNECTION'
  },
  {
    label: '返还时测试',
    value: 'RETURN_CONNECTION'
  },
  {
    label: '获取、返还连接时测试',
    value: 'GET_AND_RETURN_CONNECTION'
  },
  {
    label: '返还时关闭连接',
    value: 'RETURN_AND_CLOSE_CONNECTION'
  },
  {
    label: '不测试连接',
    value: 'NO_TEST_CONNECTION'
  }
] as const;

export const DATA_SOURCE_CHARTSET_OPTION:any[] = [
  {
    label: 'utf8',
    value: 'utf8'
  },
  {
    label: 'gbk',
    value: 'gbk'
  }
]as const;
