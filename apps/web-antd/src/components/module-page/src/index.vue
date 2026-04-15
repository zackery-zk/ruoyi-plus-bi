<script setup lang="ts">
import type { ResourceVO } from '#/api/resource/model';

import { ref } from 'vue';

import {
  type ContextMenuKeyEnum,
  type ModuleTypeEnum,
  TabModuleKey,
} from '@vben/constants';

import { ModuleTabbar } from '#/components/module-tabbar';
import ResourceTree from '#/views/resource/resource-tree.vue';
interface Props {
  module: ModuleTypeEnum;
  tabModuleKey: TabModuleKey;
}
defineProps<Props>();

const emit = defineEmits<{
  (e: 'doubleClick', data: ResourceVO): void;
  (e: 'clickMenuItem', key: ContextMenuKeyEnum, node: ResourceVO): void;
  (e: 'tabEvent', param: any): void;
}>();

const collspan = ref<boolean>(false);

function handleDoubleClick(data: ResourceVO) {
  emit('doubleClick', data);
}
function handleClickMenuItem(key: ContextMenuKeyEnum, node: ResourceVO) {
  emit('clickMenuItem', key, node);
}
const resourceTreeRef = ref();

function handleReload(resPid: number | string) {
  resourceTreeRef.value.handleReload(null, resPid);
}

function handleTabEvent(param: any) {
  emit('tabEvent', param);
}

function handleCollspan(show:boolean){
  collspan.value = show;
}


defineExpose({
  handleReload,
  handleCollspan,
});
</script>

<template>
  <div class="w-full h-[calc(100vh-50px)]">
    <a-layout class="w-full h-full" has-sider>
      <a-layout-sider
        width="15%"
        class="border-r border-border bg-background"
        collapsible
        theme="light"
        v-model:collapsed="collspan"
        collapsed-width="0"
      >
        <ResourceTree
          v-show="!collspan"
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
      </a-layout-sider>
      <a-layout-content class="demo-content">
        <ModuleTabbar
          :module-key="tabModuleKey"
          @tab-event="handleTabEvent"
          v-model:collspan="collspan"
        />
      </a-layout-content>
    </a-layout>
  </div>
</template>

<style scoped></style>
