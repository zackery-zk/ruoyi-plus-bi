import type { CatalogInfo, ConnectionInfo, JdbcTable, SchemaInfo } from './model';

import type { ID } from '#/api/common';

import { alovaInstance } from '#/utils/http';

/**
 * 通过JDBC获取所有catalog
 * @param dataSourceId
 * @returns any
 */
export function getAllJdbcCatalog(dataSourceId: ID) {
  return alovaInstance.post<CatalogInfo[]>('/matedata/get_all_jdbc_catalog', {
    dataSourceId,
  });
}

/**
 * 通过JDBC获取所有schema
 * @param dsId
 * @returns any
 */
export function getAllJdbcSchema(dataSourceId: ID) {
  return alovaInstance.post<SchemaInfo[]>('/matedata/get_all_jdbc_schema', {
    dataSourceId,
  });
}

/**
 * 通过JDBC获取所有表
 * @param dataSourceId
 * @param schema
 * @param catalog
 * @returns any
 */
export function getAllJdbcTable(
  dataSourceId: ID,
  _catalog?: string,
  schemaName?: string,
) {
  return alovaInstance.post<JdbcTable[]>('/matedata/get_all_jdbc_table', {
    dataSourceId,
    schemaName,
  });
}

/**
 * 获取当前连接数据源信息
 * @param dataSourceId
 * @returns any
 */
export function getConnectionInfo(dataSourceId: ID) {
  return alovaInstance.post<ConnectionInfo>('/matedata/get_connection_info', {
    dataSourceId,
  });
}
