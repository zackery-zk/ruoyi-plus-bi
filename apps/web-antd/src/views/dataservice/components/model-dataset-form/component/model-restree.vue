<script setup lang="ts">
import type { ResourceVO } from '#/api/resource/model';

import { h } from 'vue';

import { ResourceTypeEnum } from '@vben/constants';

import {
  PlusOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
} from '@antdv-next/icons';

import ModelResourceTree from '#/views/resource/model-resource-tree.vue';

import { useGraphFlowStore } from '../store/useGraphFlowStore';

const graphFlowStore = useGraphFlowStore();

function handleDragStart(event: MouseEvent, data: ResourceVO) {
  if (data.resType !== ResourceTypeEnum.BASIC_TABLE) {
    return;
  }
  graphFlowStore.addGraphNode(data, event);
}
</script>

<template>
  <div class="w-full h-full">
    <a-splitter orientation="vertical" style="height: 100%">
      <a-splitter-panel min="20%" max="80%" default-size="60%">
        <div class="h-full w-full flex flex-col">
          <div
            class="border-b border-border h-[28px] justify-between items-center flex px-1"
          >
            <div class="text-xs">
              引用资源

              <a-tooltip
                title="这里是引用资源，源资源修改了，这里需要手动同步。"
              >
                <QuestionCircleOutlined />
              </a-tooltip>
            </div>
            <div>
              <a-button :icon="h(SearchOutlined)" size="small" type="text" />
            </div>
          </div>
          <div class="flex-1 w-full h-0 overflow-auto" id="model-resource-tree">
            <ModelResourceTree @drag-start="handleDragStart" />
          </div>
        </div>
      </a-splitter-panel>
      <a-splitter-panel min="20%" max="80%" default-size="40%">
        <div class="h-full w-full flex flex-col">
          <div
            class="flex items-center h-[28px] border-b border-border justify-between px-1"
          >
            <div class="text-xs">内置资源</div>
            <div class="flex items-center gap-2">
              <a-button type="text" :icon="h(PlusOutlined)" size="small" />
            </div>
          </div>
          <div class="flex-1 w-full h-0 overflow-auto"></div>
        </div>
      </a-splitter-panel>
    </a-splitter>
  </div>
</template>
