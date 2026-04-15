import type { ID } from '#/api/common';
import type {
  ModelNode,
  ModelNodeField,
} from '#/api/dataservice/model-dataset/model';
import type { BasicField } from '#/api/datasource/field/model';

import { ref } from 'vue';

import {
  AggTypeEnum,
  DataTypeEnum,
  ModelNodeFieldTypeEnum,
  type ModelNodeTypeEnum,
} from '@vben/constants';

import { defineStore } from 'pinia';

import { getTableAndFieldsById } from '#/api/datasource';

import { useGraphFlowStore } from './useGraphFlowStore';

export const useModelDataSetStore = defineStore('modelDataSet', () => {
  const graphFlowStore = useGraphFlowStore();

  //模型节点
  const dataModelNodes = ref<ModelNode[]>([]);

  const selectNodeId = ref<ID | null>(null);

  // 添加节点
  function addModelNode(resId: ID, nodeId: ID) {
    getTableAndFieldsById(resId)
      .then((table) => {
        const nodeData = {
          nodeId,
          nodeName: table.tableName,
          nodeAlias: table.tableAlias,
          nodeDesc: table.tableDesc,
          nodeType: table.tableType as ModelNodeTypeEnum,
          refResId: table.tableId,
          dsId: table.dsId,
          parentId: null,
          visible:true,
          nodeFields: convertModelFields(table.fields || []),
        } as ModelNode;
        dataModelNodes.value.push(nodeData);
      })
      .catch((error) => console.log(error));
  }

  /**将基础字段转换为模型字段 */
  function convertModelFields(fields: BasicField[]): ModelNodeField[] {
    const modelFields: ModelNodeField[] = [];
    for (const field of fields) {
      const dataType = field.dataType as DataTypeEnum;
      const isMeasure = isMeasureField(dataType);
      const obj = {
        fieldId: field.fieldId,
        fieldName: field.fieldName,
        fieldAlias: field.fieldAlias,
        fieldDesc: field.fieldDesc,
        fieldType: separateFieldTypes(field.dataType as DataTypeEnum),
        dataType: field.dataType as DataTypeEnum,
        aggType: AggTypeEnum.SUM,
        visible: true,
        dataFormat: field.dataFormat,
        transformRule: '',
        maskRule: '',
        refFieldId: field.fieldId,
        refFieldName: field.fieldName,
      } as ModelNodeField;
      modelFields.push(obj);
    }
    return modelFields;
  }

  /** 区分模型节点字段类别，两种格式，ModelNodeFieldTypeEnum */
  function separateFieldTypes(dataType: DataTypeEnum) {
    switch (dataType) {
      case DataTypeEnum.BigDecimal:
      case DataTypeEnum.BigInteger:

      case DataTypeEnum.Double:
      case DataTypeEnum.Float:
      case DataTypeEnum.Integer:
      case DataTypeEnum.Long: {
        return ModelNodeFieldTypeEnum.MEASURE;
      }
      case DataTypeEnum.Date:
      case DataTypeEnum.DateTime:
      case DataTypeEnum.String:
      case DataTypeEnum.Time: {
        return ModelNodeFieldTypeEnum.DIMENSION;
      }

      default: {
        return ModelNodeFieldTypeEnum.DIMENSION;
      }
    }
  }

  /**判断是否为度量字段 */
  function isMeasureField(dataType: DataTypeEnum) {
    switch (dataType) {
      case DataTypeEnum.BigDecimal:
      case DataTypeEnum.BigInteger:

      case DataTypeEnum.Float:
      case DataTypeEnum.Integer:
      case DataTypeEnum.Long: {
        return true;
      }
    }
    return false;
  }

  /**获取模型节点字段 */
  function getModelNodeField(nodeId: number | string): ModelNodeField[] {
    const modelNode = getModelNodeById(nodeId);
    if (modelNode) {
      return modelNode.nodeFields;
    }
    return [];
  }

  function getModelNodeById(nodeId: number | string): ModelNode | undefined {
    return dataModelNodes.value.find((v) => v.nodeId === nodeId);
  }

  /**获取当前选中节点的字段列表 */
  function getSelectedModelNode(){
    if (!selectNodeId.value) {
      return null;
    }
    return getModelNodeById(selectNodeId.value);
  }




  return {
    dataModelNodes,
    selectNodeId,

    addModelNode,
    getModelNodeField,
    getModelNodeById,
    getSelectedModelNode,
  };
});
