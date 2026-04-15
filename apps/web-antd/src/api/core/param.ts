import type { ParamDataTypeEnum } from "@vben/constants";

import type { OutputFieldInfo } from "./result";

/**参数信息 */
export interface ParamInfo{
  /**参数名称 */
  paramName:string;
  /**参数值 */
  paramValue:any;
  /**参数数据类型 */
  dataType:ParamDataTypeEnum;
}

export interface BaseQuery{
  /**数据源ID */
  dsId?:number | string;
  /**当前页 */
  pageNo?:number;
  /**每页大小 */
  pageSize?:number;
  /**是否获取总行数 */
  totalRows?:boolean;
  /**参数信息 */
  params?:ParamInfo[];

  outFields?:OutputFieldInfo[];

  cache?:boolean;
}



export interface SqlSetQuery extends BaseQuery{
  /**SQL内容 */
  sqlContent:string;
}



export interface TableQuery extends BaseQuery{
  /**表ID */
  tableId:number | string;
}
