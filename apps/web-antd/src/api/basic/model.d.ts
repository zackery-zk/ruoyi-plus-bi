import type { BaseEntity, PageQuery } from '#/api/common';

export interface DataFormatVO {
  /**
   * 格式ID
   */
  formatId: number | string;

  /**
   * 格式名称
   */
  formatName: string;

  /**
   * 所属数据类型
   */
  dataType: string;

  /**
   * 格式化模版
   */
  pattern: string;

  /**
   * 变换系数
   */
  factor: number;

  /**
   * 格式
   */
  format: string;

  /**
   * 前缀
   */
  prefix: string;

  /**
   * 后缀
   */
  suffix: string;

  /**
   * 小数位数
   */
  place: number;

  /**
   * 是否内置（0代表否 1代表是）
   */
  builtIn: string;
}

export interface DataFormatForm extends BaseEntity {
  /**
   * 格式ID
   */
  formatId?: number | string;

  /**
   * 格式名称
   */
  formatName?: string;

  /**
   * 所属数据类型
   */
  dataType?: string;

  /**
   * 格式化模版
   */
  pattern?: string;

  /**
   * 变换系数
   */
  factor?: number;

  /**
   * 格式
   */
  format?: string;

  /**
   * 前缀
   */
  prefix?: string;

  /**
   * 后缀
   */
  suffix?: string;

  /**
   * 小数位数
   */
  place?: number;

  /**
   * 是否内置（0代表否 1代表是）
   */
  builtIn?: string;
}

export interface DataFormatQuery extends PageQuery {
  /**
   * 格式名称
   */
  formatName?: string;

  /**
   * 所属数据类型
   */
  dataType?: string;

  /**
   * 格式化模版
   */
  pattern?: string;

  /**
   * 变换系数
   */
  factor?: number;

  /**
   * 格式
   */
  format?: string;

  /**
   * 前缀
   */
  prefix?: string;

  /**
   * 后缀
   */
  suffix?: string;

  /**
   * 小数位数
   */
  place?: number;

  /**
   * 是否内置（0代表否 1代表是）
   */
  builtIn?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
