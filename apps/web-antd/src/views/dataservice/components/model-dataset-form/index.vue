<script lang="tsx" setup>
import { h, onMounted, ref } from 'vue';

import { LeftOutlined, RightOutlined } from '@antdv-next/icons';
import { getTeleport } from '@antv/x6-vue-shape';

import { BiCardPanel } from '#/components/bi-card-panel';

import {ModelFooter} from './component/model-footer';
import ModelRestree from './component/model-restree.vue';
import ModelRight from './component/model-right.vue';
import ModelTools from './component/model-tools.vue';
import { initModelDataSet } from './hooks/useModelDataSet';
import { useGraphFlowStore } from './store/useGraphFlowStore';
import { useModelDataSetStore } from './store/useModelDataSetStore';
const loading = ref(false);
const TeleportContainer = getTeleport();
const graphFlowStore = useGraphFlowStore();
const modelDataSetStore = useModelDataSetStore();
initModelDataSet(async () => {
  graphFlowStore.initGraphFlowCanvas();
});

onMounted(() => {
  loading.value = true;
  try {} finally {
    loading.value = false;
  }
});
</script>

<template>
  <BiCardPanel :loading="loading">
    <template #actions>
      <a-flex gap="12" justify="end">
        <a-button type="primary" :loading="loading"> 保 存 </a-button>
      </a-flex>
    </template>

    <a-splitter
      style="width: 100%;height: 100%;"
      :collapsible-icon="{
        start: h(LeftOutlined, { class: 'bi-collapsible-icon' }),
        end: h(RightOutlined, { class: 'bi-collapsible-icon' }),
      }"
    >
      <a-splitter-panel
        min="15%"
        max="40%"
        default-size="15%"
        :collapsible="{ start: true, end: true, showCollapsibleIcon: true }"
      >
        <ModelRestree />
      </a-splitter-panel>
      <a-splitter-panel>
        <a-splitter orientation="vertical">
          <a-splitter-panel class="relative">
            <div
              class="!w-full !h-full0;"
              id="graph-flow-container"
            ></div>
            <TeleportContainer />
            <ModelTools />
          </a-splitter-panel>
          <a-splitter-panel min="20%" max="80%" default-size="40%" collapsible>
            <ModelFooter />
          </a-splitter-panel>
        </a-splitter>
      </a-splitter-panel>
      <a-splitter-panel
        min="15%"
        max="40%"
        default-size="15%"
        :collapsible="{ start: true, end: true, showCollapsibleIcon: true }"
      >
        <ModelRight />
      </a-splitter-panel>
</a-splitter>
  </BiCardPanel>
</template>

<style lang="scss" scoped>
:deep(.bi-collapsible-icon) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: hsl(var(--background));
  border: 1px solid hsl(var(--border));
  border-radius: 50%;
  box-shadow: var(--shadow);
}
</style>
