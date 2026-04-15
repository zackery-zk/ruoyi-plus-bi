import type { TableQuery } from '../core/param';
import type { QueryResult } from '../core/result';
import type { JdbcTable } from '../metadata/model';
import type { BasicField } from './field/model';
import type { DatasourceForm, DatasourceVO } from './model';
import type { BasicTable } from './table/model';

import type { ID } from '#/api/common';

import { alovaInstance } from '#/utils/http';

/**
 * 根据ID获取数据源信息
 * @param id
 */
export function getDataSource(id: ID) {
  return alovaInstance.post<DatasourceVO>('/datasource/get', { id });
}
/** 测试连接数据源 */
export function testConnection(data: DatasourceForm) {
  return alovaInstance.post<boolean>('/datasource/testConnection', data);
}

/** 新增数据源 */
export function createDatasource(data: DatasourceForm) {
  return alovaInstance.post<ID>('/datasource/create', data);
}

/** 修改数据源 */
export function updateDatasource(data: DatasourceForm) {
  return alovaInstance.post<ID>('/datasource/update', data);
}

/**
 * 获取已选择的表
 * @param id 数据源ID
 * @returns any
 */
export function getSelectedTables(id: ID) {
  return alovaInstance.post<BasicTable[]>('/datasource/selectedTables', {
    id,
  });
}

/**
 * 更新选中数据源表
 * @param dsId
 * @param selectTables
 */
export function updateSelectedTables(dsId: ID, selectTables: JdbcTable[]) {
  return alovaInstance.postWithMsg<any>(
    '/datasource/updateSelectedTables',
    selectTables,
    {
      params: { dsId },
    },
  );
}

/**
 * 同步表结构
 * @param id 数据表ID
 * @returns any
 */
export function syncTable(id: ID) {
  return alovaInstance.postWithMsg<void>('/datasource/syncTable', {
    id,
  });
}

/**
 * 根据表ID获取字段列表
 */
export function getTableById(tableId: ID) {
  return alovaInstance.post<BasicTable>('/datasource/getTableById', {
    id: tableId,
  });
}

/**
 * 根据表ID获取字段列表
 */
export function getFieldByTableId(tableId: ID) {
  return alovaInstance.post<BasicField[]>('/datasource/getFieldByTableId', {
    id: tableId,
  });
}

/**
 * 修改字段信息
 */
export function updateBasicFields(basicFields: BasicField[], tableId: ID) {
  return alovaInstance.postWithMsg<void>('/datasource/updateBasicFields', {
    basicFields,
    tableId,
  });
}

/**
 * 获取表数据
 */
export function queryTableData(query:TableQuery) {
  return alovaInstance.post<QueryResult>('/datasource/queryTableData', query);
}

/**
 * 根据数据源ID获取所有表
 */
export function getAllTableByDsId(id: ID) {
  return alovaInstance.post<BasicTable[]>('/datasource/getAllTableByDsId', {
    id,
  });
}

/**
 * 获取表信息及字段信息
 *
 */
export function getTableAndFieldsById(id: ID) {
  return alovaInstance.post<BasicTable>('/datasource/getTableAndFieldsById', {
    id,
  });
}
