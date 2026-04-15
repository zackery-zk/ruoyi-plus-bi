// 选中节点字段类型
export interface SelectFieldType {
  // 节点ID
  nodeId: number | string;
  // 节点字段ID
  nodeFieldId: number | string;
}

// 节点公共属性
export interface CommonProps {
  selectNodeId: null | number | string;
  selectNodeField: null | SelectFieldType;
}

// 数据模型配置属性
export interface SettingProps {
  // 连接模式
  linkMode: 'DIRECT_CONNECTION' | 'EXTRACT';
}

/** 数据模型节点类型 */
export interface ModelNode {
  // 节点ID
  nodeId: string;
  // 节点名称
  nodeName: string;
  // 节点别名
  nodeAlias: string;
  // 节点描述
  nodeDesc: string;
  // 节点类型
  nodeType: import('@vben/constants').ModelNodeTypeEnum;
  // 引用资源ID
  refResId: number | string;
  // 数据源Id
  dsId: number | string;
  // 父节点ID
  parentId: null | number | string;
  // 节点字段
  nodeFields: ModelNodeField[];

  // 是否可见
  visible: boolean;
  // 节点位置相关信息
  props?: {
    height: number;
    left: number;
    right: number;
    width: number;
  };
}

/** 数据模型节点维度字段类型 */
export interface ModelNodeField {
  // 节点ID
  nodeId: number | string;
  // 字段ID
  fieldId: number | string;
  // 字段名称
  fieldName: string;
  // 字段别名
  fieldAlias: string;
  // 字段描述
  fieldDesc: string;
  // 字段类型
  fieldType: import('@vben/constants').ModelNodeFieldTypeEnum;
  // 数据类型
  dataType: import('@vben/constants').DataTypeEnum;
  // 是否可见
  visible: boolean;
  // 数据格式
  dataFormat: string;
  // 转换规则
  transformRule: string;
  // 脱敏规则
  maskRule: string;
  // 聚合类型
  aggType?: import('@vben/constants').AggTypeEnum;
  // 引用字段ID
  refFieldId: number | string;
  // 引用字段名称
  refFieldName: string;
  // 父级目录ID
  parentId: null | number | string;
}

/** 数据模型节点关系类型 */
export interface ModelNodeRelation {
  // 关系ID
  relationId: number | string;
  // 关系类型
  relationType: import('@vben/constants').NodeRelationTypeEnum;
  // 关系方向
  relationDirection: import('@vben/constants').NodeDirectionTypeEnum;

  // 源节点ID
  sourceNodeId: number | string;
  // 目标节点ID
  targetNodeId: number | string;
  // 字段关系
  fieldRelation: ModelNodeFieldRelation[];
}

/** 数据模型节点字段关系类型 */
export interface ModelNodeFieldRelation {
  // 源节点ID
  sourceNodeId: number | string;
  // 目标节点ID
  targetNodeId: number | string;
  // 源字段ID
  sourceFieldId: number | string;
  // 源字段名称
  sourceFieldName: string;
  // 目标字段ID
  targetFieldId: number | string;
  // 目标字段名称
  targetFieldName: string;
}
