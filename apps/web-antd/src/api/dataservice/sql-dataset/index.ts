import type { SqlDatasetForm, SqlDatasetVO, SqlSetQuery } from './model';

import type { ID } from '#/api/common';
import type { QueryResult } from '#/api/core/result';
import type { JdbcField } from '#/api/metadata/model';

import { alovaInstance } from '#/utils/http';

/**
 * 获取数据集原始数据
 */
export function queryRawData(data: SqlSetQuery) {
  return alovaInstance.post<QueryResult>('/dataset/sql/queryRawData', data);
}

/**
 * 查询SQL数据集详情
 * @param datasetId id
 * @returns SQL数据集详情
 */
export function getSqlDatasetInfo(id: ID) {
  return alovaInstance.post<SqlDatasetVO>(`/dataset/sql/query`, {
    id,
  });
}

/**
 * 检测SQL输出字段
 */
export function detectOutfields(dsId: ID, sql: string) {
  return alovaInstance.post<JdbcField[]>(`/dataset/sql/detect/fields`, {
    dsId,
    sql,
  });
}

/**
 * 创建SQL数据集
 * @param data
 */
export function createSqlDataSet(data: SqlDatasetForm) {
  return alovaInstance.post<ID>('/dataset/sql/create', data);
}

/**
 * 修改SQL数据集
 * @param data
 */
export function updateSqlDataSet(data: SqlDatasetForm) {
  return alovaInstance.post<ID>('/dataset/sql/update', data);
}
