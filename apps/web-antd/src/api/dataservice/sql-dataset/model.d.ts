import type { DataTypeEnum } from '@vben/constants';

import type { BaseEntity } from '#/api/common';

export interface SqlDatasetVO {
  /**
   * SQL数据集ID
   */
  datasetId: number | string;

  /**
   * SQL数据集名称
   */
  datasetName: string;

  /**
   * SQL数据集别名
   */
  datasetAlias: string;

  /**
   * SQL数据集描述
   */
  datasetDesc: string;

  /**
   * 数据源ID
   */
  dsId: number | string;

  /**
   * SQL数据集参数
   */
  sqlContent: string;

  /**
   * SQL数据集参数
   */
  datasetParam:string;

  /**
   * 数据集字段
   */
  datasetFields: string;

  /**
   * 数据集配置
   */
  datasetConfig: string;

  /**
   * 扩展字段
   */
  extended: string;

}

export interface SqlDatasetForm extends BaseEntity {
  /**
   * SQL数据集ID
   */
  datasetId?: number | string;


  /**
   * 父级目录ID
   */
  parentId?:number|string;

  /**
   * SQL数据集名称
   */
  datasetName?: string;

  /**
   * SQL数据集别名
   */
  datasetAlias?: string;

  /**
   * SQL数据集描述
   */
  datasetDesc?: string;

  /**
   * 数据源ID
   */
  dsId?: number | string;

  /**
   * SQL数据集参数
   */
  sqlContent?: string;

  /**
   * SQL数据集参数
   */
  datasetParam?: string;

  /**
   * 数据集字段
   */
  datasetFields?: string;

  /**
   * 数据集配置
   */
  datasetConfig?: string;

  /**
   * 扩展字段
   */
  extended?: string;

}

export interface SqlDataSetParam{
   /**
   * 参数名称
   */
   paramName: string;
   /**
    * 参数别名
    */
   paramAlias?: string;

   /**
    * 数据类型
    */
   dataType: string;

   /**
    * 默认值
    */
   defaultValue?: any;

   /**
    * 是否必填
    */
   required: boolean;
}

export interface SqlDatasetField{
  fieldId:number|string;
  fieldName:string;
  fieldAlias:string;
  fieldDesc:string;
  dataType:DataTypeEnum;
  maskRule:number|string;
  dataFormat:number|string;
  transformRule:number|string;
}


export interface DatasetConfig {
  cacheEnable: boolean;
  cacheTime: number;
  cacheTimeUnit: 'hour' | 'minute' | 'second';
}

