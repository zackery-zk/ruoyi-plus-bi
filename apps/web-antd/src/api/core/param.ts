import type { ParamDataTypeEnum } from "@vben/constants";

/**参数信息 */
export interface ParamInfo{
  /**参数名称 */
  paramName:string;
  /**参数值 */
  paramValue:any;
  /**参数数据类型 */
  dataType:ParamDataTypeEnum;
}
