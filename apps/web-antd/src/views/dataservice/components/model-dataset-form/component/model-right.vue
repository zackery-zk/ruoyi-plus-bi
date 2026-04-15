<script setup lang="tsx">
import type { BasicDataNode, TreeDataNode } from 'antdv-next';

import { computed } from 'vue';

import { type AggTypeEnum, type DataTypeEnum, ModelNodeFieldTypeEnum, ResourceTypeEnum } from '@vben/constants';

import { EyeInvisibleOutlined } from '@antdv-next/icons';

import ResourceIcon from '#/views/resource/resource-icon.vue';

import { useModelDataSetStore } from '../store/useModelDataSetStore';

interface ModelField extends TreeDataNode {
  nodeType: ResourceTypeEnum,
  dataType?: DataTypeEnum,
  aggType?: AggTypeEnum
  visible?: boolean;
}

const modelDataSetStore = useModelDataSetStore();


const treeData = computed(() => {
  const modeNods = modelDataSetStore.dataModelNodes;

  const treeData = [];

  for (const node of modeNods) {
    console.log(node);
    var data = {
      key: node.nodeId,
      label: node.nodeAlias || node.nodeName,
      nodeType: ResourceTypeEnum.FOLDER,
      visible: node.visible,
      children: [],
    } as unknown as ModelField;

    const dimension = {
      key: node.nodeId + '_dimension',
      label: '维度',
      visible:true,
      nodeType: ResourceTypeEnum.DIMENSION,
      children: node.nodeFields.filter((f) => f.fieldType === ModelNodeFieldTypeEnum.DIMENSION).map(m => {
        return {
          key: m.fieldId,
          label: m.fieldAlias || m.fieldName,
          nodeType: m.fieldType,
          dataType: m.dataType,
          aggType: m.aggType,
          visible: m.visible,
        } as unknown as ModelField
      })
    } as unknown as ModelField;
    const measure = {
      key: node.nodeId + '_measure',
      label: '度量',
      visible:true,
      nodeType: ResourceTypeEnum.MEASURE,
      children: node.nodeFields.filter((f) => f.fieldType === ModelNodeFieldTypeEnum.MEASURE).map(m => {
        return {
          key: m.fieldId,
          label: m.fieldAlias || m.fieldName,
          nodeType: m.fieldType,
          dataType: m.dataType,
          aggType: m.aggType,
          visible: m.visible,
        } as unknown as ModelField
      })
    } as unknown as ModelField;

    data.children!.push(dimension, measure)
    treeData.push(data);
  }
  return treeData;
})



function iconRender({ data }: { data: ModelField }) {
  if (data.visible) {
    return <ResourceIcon aggType={data.aggType} dataType={data.dataType} resIcon={data.resIcon} resType={data.nodeType} />;
  }
  return <EyeInvisibleOutlined />
}

function titleRender(data: BasicDataNode) {
  return (
    <div class="ml-1 flex w-full h-full items-center justify-between">
      <div class="select-none">
        {data.label}
      </div>
    </div>
  );
}
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <div class="w-full h-[32px] border-b border-border flex items-center justify-between px-2">
      <div>元数据</div>
      <div>+</div>
    </div>
    <div class="flex-1 h-0 overflow-auto w-full p-2">
      <a-config-provider
:theme="{
        components: {
          Tree: {
            directoryNodeSelectedBg: 'hsl(var(--primary-100))',
            directoryNodeSelectedColor: 'hsl(var(--foreground))',
            titleHeight: 32,
            switcherSize: 16,
          },
        },
      }"
>
        <a-directory-tree
v-bind="$attrs" :class="$attrs.class" :tree-data="treeData" :selectable="false"
          :virtual="false" :expand-action="false" :show-icon="true" :icon="iconRender" :classes="{
            item: 'bi-res-tree-item',
          }" :styles="{
            item: {
              '--ant-tree-node-selected-bg': 'transparent',
            },
            itemTitle: {
              display: 'inline-block',
              width: 'calc(100% - 16px)',
            },
          }" :title-render="titleRender"
/>
      </a-config-provider>
    </div>
  </div>
</template>
