<script setup lang="ts">
import type { ContextMenuKeyEnum, ModuleTypeEnum } from '@vben/constants';

import type { ResourceVO } from '#/api/resource/model';

import { ref } from 'vue';

import ResourceTree from '#/views/resource/resource-tree.vue';
interface Props {
  module: ModuleTypeEnum;
}
defineProps<Props>();

const emit = defineEmits<{
  (e: 'doubleClick', data: ResourceVO): void;
  (e: 'clickMenuItem', key: ContextMenuKeyEnum, node: ResourceVO): void;
}>();

function handleDoubleClick(data: ResourceVO) {
  emit('doubleClick', data);
}
function handleClickMenuItem(key: ContextMenuKeyEnum, node: ResourceVO) {
  emit('clickMenuItem', key, node);
}
const resourceTreeRef = ref();

const size = ref<string>('15%');


function handleReload(resPid: number | string) {
  resourceTreeRef.value.handleReload(null, resPid);
}

defineExpose({
  handleReload,
});
</script>

<template>
  <div class="w-full h-[calc(100vh-50px)]">
    <a-splitter>
      <a-splitter-panel :default-size="size" min="15%" max="40%" collapsible>
        <ResourceTree
          :module="module"
          class="h-full w-full bg-background"
          @double-click="handleDoubleClick"
          @click-menu-item="handleClickMenuItem"
          ref="resourceTreeRef"
        >
          <template #toolbar-actions>
            <slot name="toolbar-actions"></slot>
          </template>
        </ResourceTree>
      </a-splitter-panel>
      <a-splitter-panel class="min-h-0">
        <slot></slot>
      </a-splitter-panel>
    </a-splitter>
  </div>
</template>

<style scoped></style>
