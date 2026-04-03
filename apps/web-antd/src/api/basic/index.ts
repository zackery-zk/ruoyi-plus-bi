import type { DataFormatQuery, DataFormatVO } from './model';

import { alovaInstance } from '#/utils/http';

/**
 * 查询数据格式列表
 * @param params
 * @returns 数据格式列表
 */
export function getDataFormatList(params?: DataFormatQuery) {
  return alovaInstance.post<DataFormatVO[]>('/basic/data/format/list', params);
}
