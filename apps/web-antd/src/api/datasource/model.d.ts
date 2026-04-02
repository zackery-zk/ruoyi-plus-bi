import type { BaseEntity, PageQuery } from '#/api/common';

export interface DatasourceVO {
  /**
   * 数据源ID
   */
  datasrcId: number | string;

  /**
   * 数据源名称
   */
  datasrcName: string;

  /**
   * 数据源别名
   */
  datasrcAlias: string;

  /**
   * 数据库描述
   */
  datasrcDesc: string;

  /**
   * 数据源类型
   */
  datasrcType: string;

  /**
   * 驱动目录
   */
  driverPath: string;

  /**
   * 驱动类
   */
  driverClass: string;

  /**
   * 连接字符串
   */
  datasrcUrl: string;

  /**
   * 认证类型
   */
  authType: string;

  /**
   * 用户名
   */
  datasrcUser: string;

  /**
   * 密码
   */
  datasrcPwd: string;

  /**
   * 连接池配置
   */
  poolConfig: string;

  /**
   * 事务隔离级别
   */
  isolation: string;

  /**
   * 自动开启事务0为不开启、1为开启
   */
  autoCommit: string;

  /**
   * 列别名来源
   */
  columnAliasSource: string;

  /**
   * 数据库字符集
   */
  characterSet: string;

  /**
   * 引用标识符
   */
  quotedIden: number | string;

  /**
   * 校验查询方法
   */
  valMethod: string;

  /**
   * 校验SQL语句
   */
  valQuery: string;

}

export interface DatasourceForm extends BaseEntity {
  /**
   * 数据源ID
   */
  datasrcId?: number | string;

  /**
   * 父级ID
   */
  parentId?:ID;

  /**
   * 数据源名称
   */
  datasrcName?: string;

  /**
   * 数据源别名
   */
  datasrcAlias?: string;

  /**
   * 数据库描述
   */
  datasrcDesc?: string;

  /**
   * 数据源类型
   */
  datasrcType?: string;

  /**
   * 驱动目录
   */
  driverPath?: string;

  /**
   * 驱动类
   */
  driverClass?: string;

  /**
   * 连接字符串
   */
  datasrcUrl?: string;

  /**
   * 认证类型
   */
  authType?: string;

  /**
   * 用户名
   */
  datasrcUser?: string;

  /**
   * 密码
   */
  datasrcPwd?: string;

  /**
   * 连接池配置
   */
  poolConfig?: string;

  /**
   * 事务隔离级别
   */
  isolation?: string;

  /**
   * 自动开启事务0为不开启、1为开启
   */
  autoCommit?: string;

  /**
   * 列别名来源
   */
  columnAliasSource?: string;

  /**
   * 数据库字符集
   */
  characterSet?: string;

  /**
   * 引用标识符
   */
  quotedIden?: number | string;

  /**
   * 校验查询方法
   */
  valMethod?: string;

  /**
   * 校验SQL语句
   */
  valQuery?: string;

}

export interface DatasourceQuery extends PageQuery {
  /**
   * 数据源名称
   */
  datasrcName?: string;

  /**
   * 数据源别名
   */
  datasrcAlias?: string;

  /**
   * 数据库描述
   */
  datasrcDesc?: string;

  /**
   * 数据源类型
   */
  datasrcType?: string;

  /**
   * 驱动目录
   */
  driverPath?: string;

  /**
   * 驱动类
   */
  driverClass?: string;

  /**
   * 连接字符串
   */
  datasrcUrl?: string;

  /**
   * 认证类型
   */
  authType?: string;

  /**
   * 用户名
   */
  datasrcUser?: string;

  /**
   * 密码
   */
  datasrcPwd?: string;

  /**
   * 连接池配置
   */
  poolConfig?: string;

  /**
   * 事务隔离级别
   */
  isolation?: string;

  /**
   * 自动开启事务0为不开启、1为开启
   */
  autoCommit?: string;

  /**
   * 列别名来源
   */
  columnAliasSource?: string;

  /**
   * 数据库字符集
   */
  characterSet?: string;

  /**
   * 引用标识符
   */
  quotedIden?: number | string;

  /**
   * 校验查询方法
   */
  valMethod?: string;

  /**
   * 校验SQL语句
   */
  valQuery?: string;

  /**
    * 日期范围参数
    */
  params?: any;
}
