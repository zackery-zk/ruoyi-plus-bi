import type { DatasourceForm, DatasourceVO } from './model';

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

