// 节点类型
export enum ModelNodeTypeEnum {
  API = 'API',
  FOLDER='FOLDER',
  SCRIPT = 'SCRIPT',
  SQL = 'SQL',
  TABLE = 'Table'
}

// 节点字段类型
export enum ModelNodeFieldTypeEnum {
  // 计算列
  CALC_COLUMN = 'CALC_COLUMN',
  // 计算度量
  CALC_MEASURE = 'CALC_MEASURE',
  // 维度
  DIMENSION = 'DIMENSION',
  // 度量
  MEASURE = 'MEASURE'
}
// 节点关系方向
export enum NodeDirectionTypeEnum {
  ONE_WAY = 'ONE_WAY', // 单向
  TWO_WAY = 'RIGHT_TO_LEFT' // 双向
}
// 节点关系
export enum NodeRelationTypeEnum {
  MANY_TO_MANY = 'MANY_TO_MANY', // 多对多
  MANY_TO_ONE = 'MANY_TO_ONE', // 多对一
  ONE_TO_MANY = 'ONE_TO_MANY', // 一对多
  ONE_TO_ONE = 'ONE_TO_ONE' // 一对一
}

/** 聚合类型 */
export enum AggTypeEnum {
  AVG = 'AVG', // 平均值
  COUNT = 'COUNT', // 计数
  DISTINCT_COUNT = 'DISTINCT_COUNT', // 唯一计数
  MAX = 'MAX', // 最大值
  MIN = 'MIN', // 最小值
  NONE = 'NONE', // 无聚合
  SUM = 'SUM' // 求和
}



export const NodeRelationTypeOptions= [
  { label: '一对一', value: NodeRelationTypeEnum.ONE_TO_ONE },
  { label: '一对多', value: NodeRelationTypeEnum.ONE_TO_MANY },
  { label: '多对一', value: NodeRelationTypeEnum.MANY_TO_ONE },
  { label: '多对多', value: NodeRelationTypeEnum.MANY_TO_MANY }
] as const;

export const NodeDirectionTypeOptions = [
  { label: '单向', value: NodeDirectionTypeEnum.ONE_WAY },
  { label: '双向', value: NodeDirectionTypeEnum.TWO_WAY }
] as const;

export const MODEL_CONNECTION_TYPE_OPTIONS:any[] = [
  { label: '直连', value: 'DIRECT' },
  { label: '抽取', value: 'EXTRACT' }
] as const;
