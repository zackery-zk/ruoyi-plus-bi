<script setup lang="ts">
interface Props {
  module: ModuleTypeEnum;
}
defineProps<Props>();



const emit = defineEmits<{
  (e: 'doubleClick', data: ResourceVO): void;
}>();

import type { ModuleTypeEnum } from '@vben/constants';

import type { ResourceVO } from '#/api/resource/model';

import ResourceTree from '#/views/resource/resource-tree.vue';
function handleDoubleClick(data: ResourceVO) {
  emit('doubleClick', data);
}
</script>

<template>
  <div class="w-full h-[calc(100vh-50px)]">
    <a-splitter>
    <a-splitter-panel default-size="15%" min="15%" max="40%" collapsible>
      <ResourceTree :module="module" class="h-full w-full bg-background" @double-click="handleDoubleClick" />
    </a-splitter-panel>
    <a-splitter-panel class="min-h-0">
     <slot></slot>
    </a-splitter-panel>
  </a-splitter>
  </div>
</template>

<style scoped></style>
